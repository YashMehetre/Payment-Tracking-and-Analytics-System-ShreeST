const { status } = require("express/lib/response");
const pool = require("../modules/database");

async function generateReportHandler(req, res) {
  let reportType = req.query.reportType;
  let vendorFirmName = req.query.vendorFirmName;
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  if (reportType == 1) {
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE billDate BETWEEN ? AND ? ORDER by billdetails.billDate`;
    try {
      const [result] = await pool.promise().execute(sql, [fromDate, toDate]);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  } else if (reportType == 2) {
    let vendorId = await getVendorId(vendorFirmName);
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE vendordetails.vendorId = ? AND billDate BETWEEN ? AND ? ORDER by billdetails.billDate`;
    try {
      const [result] = await pool
        .promise()
        .execute(sql, [vendorId, fromDate, toDate]);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  } else if (reportType == 3) {
    let vendorId = await getVendorId(vendorFirmName);
    let sql1 = `SELECT billNum as id, DATE_FORMAT(billDate, '%Y-%m-%d') as date, billPaymentAmount as pendingAmount, billTotalBoxes FROM billdetails WHERE vendorId = ? AND billDate BETWEEN ? AND ?`;

    let sql2 = `SELECT paymentId as id, DATE_FORMAT(paymentDate, '%Y-%m-%d') as date, paymentReceivedAmt as paymentAmount FROM paymentdetails WHERE vendorId = ? AND paymentDate BETWEEN ? AND ?`;

    try {
      const [result1] = await pool
        .promise()
        .execute(sql1, [vendorId, fromDate, toDate]);
      const [result2] = await pool
        .promise()
        .execute(sql2, [vendorId, fromDate, toDate]);
      let result = result1.concat(result2);

      // Parse date strings into Date objects for proper sorting
      result.forEach((item) => {
        item.date = new Date(item.date);
      });

      // Sort the result array based on the date field
      result.sort((a, b) => a.date - b.date);

      // Convert date objects back to string format
      result.forEach((item) => {
        item.date = item.date.toLocaleDateString("en-GB"); // Change locale as needed
      });

      // console.log(result);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  } else if (reportType == 4) {
    const sql = `
      SELECT
    v.vendorId AS vendorId,
    v.vendorFirm AS vendorFirm,
    COALESCE(SUM(b.billTotalBoxes), 0) AS totalBoxes,
    COALESCE(SUM(b.billTotalWeight), 0) AS totalWeight,
    COALESCE(SUM(b.billMarketAmount), 0) AS marketAmount,
    COALESCE(SUM(CASE WHEN b.billPaymentAmount IS NULL THEN 0 ELSE b.billPaymentAmount END), 0) AS paymentAmount,
    COALESCE(SUM(CASE WHEN b.billPaymentAmount IS NULL THEN 0 ELSE b.billPaymentAmount END), 0) - COALESCE(SUM(b.billMarketAmount), 0) AS profitLoss
FROM
    vendordetails v
LEFT JOIN
    billdetails b ON v.vendorId = b.vendorId
WHERE
    (b.billDate BETWEEN ? AND ? OR b.billDate IS NULL)
GROUP BY
    v.vendorId, v.vendorFirm
ORDER BY
    v.vendorId;
    `;

    try {
      const [rows] = await pool.promise().execute(sql, [fromDate, toDate]);
      res.json(rows);
    } catch (error) {
      console.error("Error generating master report:", error);
      throw error;
    }
    // } else if (reportType == 4) {
    //   res.json({ status: "success" });
    // }
  }
}
const getVendorId = async (vendorFirm) => {
  let sql = `SELECT vendorId FROM vendordetails WHERE vendorFirm = ?`;
  try {
    const [result] = await pool.promise().query(sql, [vendorFirm]);
    if (result.length > 0) {
      return result[0].vendorId;
    }
    return null; // Handle case where vendorFirm is not found
  } catch (error) {
    console.log(error);
    throw error;
  }
};
async function handleAddBillPaymentAmount(req, res) {
  let billNum = req.query.billNum;
  let billPaymentAmount = req.query.billPaymentAmount;
  let sql = `UPDATE billdetails SET billPaymentAmount = ? WHERE billNum = ?`;
  try {
    await pool.promise().execute(sql, [billPaymentAmount, billNum]);
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { generateReportHandler, handleAddBillPaymentAmount };
