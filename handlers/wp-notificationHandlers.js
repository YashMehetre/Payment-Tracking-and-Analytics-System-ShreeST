const pool = require("../modules/database");
const env = require("dotenv");
const axios = require("axios");
env.config();
const whatsappPhoneNumID = process.env.WHATSAPP_PHONE_NUM_ID;
const whatsappAccessToken = process.env.WHATSAPP_TOKEN;

const getVendorDetails = async (vendorID) => {
  const sql = `SELECT * FROM vendordetails WHERE vendorId = ?`;
  try {
    const [result] = await pool.promise().execute(sql, [vendorID]);
    if (result.length === 0) {
      throw new Error("Vendor not found");
    }
    return result[0]; // Return the first vendor
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    throw error;
  }
};
const getBillDetails = async (billNum) => {
  let sql = `SELECT * FROM billDetails WHERE billNum = ?`;
  try {
    const [result] = await pool.promise().execute(sql, [billNum]);
    if (result.length === 0) {
      throw new Error("Bill not found");
    }
    return result[0];
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    throw error;
  }
};
const sendTemplateMessage = async (vendorID) => {
  try {
    const vendorDetails = await getVendorDetails(vendorID);
    const vendorContact = vendorDetails.vendorContact1;
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${whatsappPhoneNumID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${whatsappAccessToken}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: `91${vendorContact}`,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
        },
      },
    });
    console.log("✅ Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error("❌ Unexpected Error:", error.message);
      throw new Error(error.message);
    }
  }
};

const sendPendingPartyAmountMessage = async (billNum) => {
  try {
    const billDetails = await getBillDetails(billNum);
    const vendorId = billDetails.vendorId;
    const billDate = billDetails.billDate;
    // const billGoodsType = billDetails.billGoodsType;
    const billTotalBoxes = billDetails.billTotalBoxes;

    const vendorDetails = await getVendorDetails(vendorId);
    const vendorContact = vendorDetails.vendorContact1;
    const vendorFirm = vendorDetails.vendorFirm;

    // Using Intl.DateTimeFormat for custom formatting
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "short", // Full weekday name (e.g., "Thursday")
      day: "2-digit", // Day in two digits (e.g., "02")
      month: "short", // Short month name (e.g., "Jan")
      year: "numeric", // Full year (e.g., "2025")
    }).format(billDate);

    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${whatsappPhoneNumID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${whatsappAccessToken}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: `91${vendorContact}`,
        type: "text",
        text: {
          body: `
प्रिय ${vendorFirm},

कृपया निम्न विवरण के लिए *बिक्री(Sales) रिपोर्ट* साझा करें:

📦 माल का प्रकार: *अनार*

📅 तिथि: *${formattedDate}*

📊 कुल बॉक्स: *${billTotalBoxes}*

आपके शीघ्र उत्तर की प्रतीक्षा है।

*श्री साई ट्रेडिंग कंपनी, राहता*
`,
        },
      },
    });
    console.log("✅ Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error("❌ Unexpected Error:", error.message);
      throw new Error(error.message);
    }
  }
};

const handleSendTemplateMessage = async (req, res) => {
  const { vendorID } = req.body;
  try {
    const result = await sendTemplateMessage(vendorID);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Handler Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const handleSendPendingPartyAmountMessage = async (req, res) => {
  const { billNum } = req.body;
  try {
    const result = await sendPendingPartyAmountMessage(billNum);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Handler Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  handleSendTemplateMessage,
  handleSendPendingPartyAmountMessage,
};
