const pool = require("../modules/database");

async function handleAddPaymentData(req, res) {
  const {
    vendorFirmName,
    paymentModeName,
    paymentDate,
    paymentReceivedAmt,
    paymentMoreDetails,
  } = req.body;
  const vendorId = await getVendorId(vendorFirmName);
  const paymentModeId = await getPaymentModeId(paymentModeName);
  if (vendorId && paymentModeId) {
    let sql = `INSERT INTO paymentdetails (vendorId, paymentModeId, paymentDate, paymentReceivedAmt, paymentMoreDetails) VALUES (?, ?, ?, ?, ?)`;
    try {
      const [result] = await pool
        .promise()
        .execute(sql, [
          vendorId,
          paymentModeId,
          paymentDate,
          paymentReceivedAmt,
          paymentMoreDetails,
        ]);
      if (result.affectedRows === 1) {
        res.json({ status: 1 });
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("Invalid Vendor Firm Name or Payment Mode Name");
  }
}

const getVendorId = async (vendorFirm) => {
  let sql = `SELECT vendorId FROM vendordetails WHERE vendorFirm = "${vendorFirm}"`;
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
async function getPaymentModeId(paymentModeName) {
  let sql = `SELECT paymentModeId FROM paymentmode where paymentModeName = "${paymentModeName}"`;
  try {
    const [result] = await pool.promise().query(sql, [paymentModeName]);
    if (result.length > 0) {
      return result[0].paymentModeId;
    }
    return null; // Handle case where paymentModeName is not found
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function handleFetchPaymentModesForSelect(req, res) {
  let sql = `SELECT paymentModeId, paymentModeName FROM paymentmode WHERE paymentModeStatus = "Active"`;
  try {
    const [result] = await pool.promise().execute(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
async function handleFetchPaymentDetails(req, res) {
  let paymentId = req.query.paymentId;
  let sql = `SELECT paymentId, vendorId, paymentModeId,DATE_FORMAT(paymentDate, '%Y-%m-%d') AS paymentDate, paymentReceivedAmt, paymentMoreDetails FROM paymentdetails WHERE paymentId = ?`;
  try {
    const [result] = await pool.promise().execute(sql, [paymentId]);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
async function handleFetchLastTenPaymentDetails(req, res) {
  let sql = `SELECT paymentId, vendorId, paymentModeId,DATE_FORMAT(paymentDate, '%Y-%m-%d') AS paymentDate, paymentReceivedAmt, paymentMoreDetails FROM paymentdetails ORDER BY paymentId DESC LIMIT 10`;
  try {
    const [result] = await pool.promise().execute(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}

async function handleSearchPaymentData(req, res) {
  // const {fromDate,toDate,vendorFirmNameSearch} = req.body;
  const { fromDate, vendorFirmNameSearch } = req.body;
  const vendorId = await getVendorId(vendorFirmNameSearch);
  // let sql = `SELECT paymentId, vendorId, paymentModeId,DATE_FORMAT(paymentDate, '%Y-%m-%d') AS paymentDate, paymentReceivedAmt, paymentMoreDetails FROM paymentdetails WHERE vendorId = ? AND DATE_FORMAT(paymentDate, '%Y-%m-%d') BETWEEN ? AND ?`;
  let sql = `SELECT paymentId, vendorId, paymentModeId,DATE_FORMAT(paymentDate, '%Y-%m-%d') AS paymentDate, paymentReceivedAmt, paymentMoreDetails FROM paymentdetails WHERE vendorId = ? AND DATE_FORMAT(paymentDate, '%Y-%m-%d') = ?`;
  try {
    // const [result] = await pool.promise().execute(sql, [vendorId, fromDate,toDate]);
    const [result] = await pool.promise().execute(sql, [vendorId, fromDate]);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
async function handleDeletePaymentDetails(req, res) {
  const { paymentId } = req.body;
  let sql = `DELETE FROM paymentdetails WHERE paymentId = ?`;
  try {
    const [result] = await pool.promise().execute(sql, [paymentId]);
    if (result.affectedRows === 1) {
      res.json({ status: 1 });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
async function handleFetchLastPaymentDate(req, res) {
  let sql = `SELECT DATE_FORMAT(paymentDate, '%Y-%m-%d') AS paymentDate FROM paymentdetails ORDER BY paymentId DESC LIMIT 1`;
  try {
    const [result] = await pool.promise().execute(sql);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handleFetchLastPaymentDate,
  handleDeletePaymentDetails,
  handleAddPaymentData,
  handleFetchPaymentModesForSelect,
  handleFetchPaymentDetails,
  handleFetchLastTenPaymentDetails,
  handleSearchPaymentData,
};
