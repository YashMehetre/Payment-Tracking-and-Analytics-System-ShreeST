    const pool = require("../modules/database");

async function generateReportHandler(req, res) {
 let reportType = req.query.reportType;
  let vendorFirmName = req.query.vendorFirmName;
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  if (reportType == 1) {
    // let sql = `SELECT * FROM billdetails WHERE billDate BETWEEN ? AND ?`;
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE billDate BETWEEN ? AND ?`;
    try {
      const [result] = await pool.promise().execute(sql, [fromDate, toDate]);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  } else if (reportType == 2){
    let vendorId = await getVendorId(vendorFirmName);
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE vendordetails.vendorId = ? AND billDate BETWEEN ? AND ?`;
    try {
      const [result] = await pool
        .promise()
        .execute(sql, [vendorId, fromDate, toDate]);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
  else if (reportType == 3){
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
      result.forEach(item => {
        item.date = new Date(item.date);
      });
    
      // Sort the result array based on the date field
      result.sort((a, b) => a.date - b.date);
    
      // Convert date objects back to string format
      result.forEach(item => {
        item.date = item.date.toLocaleDateString('en-GB'); // Change locale as needed
      });
    
      // console.log(result);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
    
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

module.exports = { generateReportHandler };
