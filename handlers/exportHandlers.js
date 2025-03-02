const pool = require("../modules/database");

/**
 * Generates various reports based on the reportType parameter.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateReportHandler(req, res) {
  const { reportType, vendorFirmName, fromDate, toDate } = req.query;
  try {
    let result;

    switch (parseInt(reportType, 10)) {
      case 1:
        result = await fetchAllBills(fromDate, toDate);
        break;
      case 2:
        result = await fetchBillsByVendor(vendorFirmName, fromDate, toDate);
        break;
      case 3:
        result = await fetchPaymentHistory(vendorFirmName, fromDate, toDate);
        break;
      case 4:
        result = await fetchProfitLossMasterReport(fromDate, toDate);
        break;
      case 5:
        result = await fetchPendingAmountMasterReport(fromDate, toDate);
        break;
      default:
        return res.status(400).json({ error: "Invalid reportType" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Fetch all bills within a date range.
 */
async function fetchAllBills(fromDate, toDate) {
  const sql = `
    SELECT 
      billdetails.billNum, 
      DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') AS billDate, 
      vendordetails.vendorFirm, 
      billdetails.billGoodsType, 
      billdetails.billTotalBoxes, 
      billdetails.billWeightPerBox, 
      billdetails.billTotalWeight, 
      billdetails.billMarketAmount, 
      billdetails.billPaymentAmount, 
      billdetails.billMoreDetails 
    FROM billdetails 
    INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId 
    WHERE billDate BETWEEN ? AND ? 
    ORDER BY billdetails.billDate`;

  const [rows] = await pool.promise().execute(sql, [fromDate, toDate]);
  return rows;
}

/**
 * Fetch bills by a specific vendor within a date range.
 */
async function fetchBillsByVendor(vendorFirmName, fromDate, toDate) {
  const vendorId = await getVendorId(vendorFirmName);
  if (!vendorId) throw new Error("Vendor not found");

  const sql = `
    SELECT 
      billdetails.billNum, 
      DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') AS billDate, 
      vendordetails.vendorFirm, 
      billdetails.billGoodsType, 
      billdetails.billTotalBoxes, 
      billdetails.billWeightPerBox, 
      billdetails.billTotalWeight, 
      billdetails.billMarketAmount, 
      billdetails.billPaymentAmount, 
      billdetails.billMoreDetails 
    FROM billdetails 
    INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId 
    WHERE vendordetails.vendorId = ? AND billDate BETWEEN ? AND ? 
    ORDER BY billdetails.billDate`;

  const [rows] = await pool.promise().execute(sql, [vendorId, fromDate, toDate]);
  return rows;
}

/**
 * Fetch payment history for a vendor within a date range.
 */
async function fetchPaymentHistory(vendorFirmName, fromDate, toDate) {
  const vendorId = await getVendorId(vendorFirmName);
  if (!vendorId) throw new Error("Vendor not found");

  const billSql = `
    SELECT billNum AS id, DATE_FORMAT(billDate, '%Y-%m-%d') AS date, billPaymentAmount AS pendingAmount, billTotalBoxes 
    FROM billdetails WHERE vendorId = ? AND billDate BETWEEN ? AND ?`;

  const paymentSql = `
    SELECT paymentId AS id, DATE_FORMAT(paymentDate, '%Y-%m-%d') AS date, paymentReceivedAmt AS paymentAmount 
    FROM paymentdetails WHERE vendorId = ? AND paymentDate BETWEEN ? AND ?`;

  const [bills] = await pool.promise().execute(billSql, [vendorId, fromDate, toDate]);
  const [payments] = await pool.promise().execute(paymentSql, [vendorId, fromDate, toDate]);

  const result = [...bills, ...payments].sort((a, b) => new Date(a.date) - new Date(b.date));
  result.forEach((item) => (item.date = new Date(item.date).toLocaleDateString("en-GB")));

  return result;
}

/**
 * Fetch master report including vendors' financial details.
 */
async function fetchProfitLossMasterReport(fromDate, toDate) {
  const sql = `
    SELECT
      v.vendorId,
      v.vendorFirm,
      COALESCE(SUM(b.billTotalBoxes), 0) AS totalBoxes,
      COALESCE(SUM(b.billTotalWeight), 0) AS totalWeight,
      COALESCE(SUM(b.billMarketAmount), 0) AS marketAmount,
      COALESCE(SUM(IFNULL(b.billPaymentAmount, 0)), 0) AS paymentAmount,
      COALESCE(SUM(IFNULL(b.billPaymentAmount, 0)), 0) - COALESCE(SUM(b.billMarketAmount), 0) AS profitLoss
    FROM vendordetails v
    LEFT JOIN billdetails b ON v.vendorId = b.vendorId
    WHERE (b.billDate BETWEEN ? AND ? OR b.billDate IS NULL)
    GROUP BY v.vendorId, v.vendorFirm
    ORDER BY v.vendorId`;

  const [rows] = await pool.promise().execute(sql, [fromDate, toDate]);
  return rows;
}
async function fetchPendingAmountMasterReport(fromDate, toDate) {
  const sql = `
    SELECT 
    v.vendorId,
    v.vendorFirm,
    COALESCE(b.totalBoxes, 0) AS totalBoxes,
    COALESCE(b.debitAmount, 0) AS debitAmount, -- Sum of bill payment amounts
    COALESCE(p.creditAmount, 0) AS creditAmount, -- Sum of payments received
    COALESCE(b.debitAmount, 0) - COALESCE(p.creditAmount, 0) AS pendingAmount -- Signed pending amount
FROM 
    vendordetails v
LEFT JOIN 
    ( -- Aggregate bills per vendor
        SELECT 
            vendorId, 
            SUM(billTotalBoxes) AS totalBoxes,
            SUM(IFNULL(billPaymentAmount, 0)) AS debitAmount
        FROM billdetails
        WHERE billDate BETWEEN ? AND ?
        GROUP BY vendorId
    ) b ON v.vendorId = b.vendorId
LEFT JOIN 
    ( -- Aggregate payments per vendor
        SELECT 
            vendorId, 
            SUM(IFNULL(paymentReceivedAmt, 0)) AS creditAmount
        FROM paymentdetails
        WHERE paymentDate BETWEEN ? AND ?
        GROUP BY vendorId
    ) p ON v.vendorId = p.vendorId
ORDER BY v.vendorId;
  `;

  try {
    const [rows] = await pool.promise().execute(sql, [fromDate, toDate, fromDate, toDate]);
    return rows; // ✅ Returning data
  } catch (error) {
    console.error("Error fetching pending amount report:", error);
    throw error; // Ensure the error propagates
  }
}




/**
 * Fetch vendor ID by firm name.
 */
async function getVendorId(vendorFirm) {
  const sql = `SELECT vendorId FROM vendordetails WHERE vendorFirm = ?`;
  const [result] = await pool.promise().query(sql, [vendorFirm]);
  return result.length ? result[0].vendorId : null;
}

/**
 * Updates bill payment amount.
 */
async function handleAddBillPaymentAmount(req, res) {
  const { billNum, billPaymentAmount } = req.query;
  const sql = `UPDATE billdetails SET billPaymentAmount = ? WHERE billNum = ?`;

  try {
    await pool.promise().execute(sql, [billPaymentAmount, billNum]);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error updating payment amount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { generateReportHandler, handleAddBillPaymentAmount };
