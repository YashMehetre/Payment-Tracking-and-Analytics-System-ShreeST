const pool = require("../modules/database"); // Database connection pool

const handleCommodityPriceTrends = async (req, res) => {
  const startDate = req.query.startDate;  // Start date in YYYY-MM-DD format
  const endDate = req.query.endDate;      // End date in YYYY-MM-DD format

  // Validate and format start and end dates
  const startDateFormatted = startDate && startDate.length === 10 ? startDate : null;
  const endDateFormatted = endDate && endDate.length === 10 ? endDate : null;

  if (!startDateFormatted || !endDateFormatted) {
    return res.status(400).send("Invalid date range provided");
  }

  // SQL query to fetch commodity price trends
  const sql = `
    SELECT 
        DATE_FORMAT(billDate, '%Y-%m') AS Month,
        AVG(billMarketAmount / billTotalWeight) AS AveragePricePerKg
    FROM 
        billdetails
    WHERE 
        billDate BETWEEN ? AND ?
    GROUP BY 
        Month
    ORDER BY 
        billDate;
  `;

  try {
    // Execute the SQL query
    const [rows] = await pool.promise().execute(sql, [startDateFormatted, endDateFormatted]);

    // If no data is returned, send an empty response
    if (rows.length === 0) {
      return res.json([["Month", "Price"]]);
    }

    // Format the response for Google Charts
    const response = [["Month", "Price"], ...rows.map(row => [row.Month, parseFloat(row.AveragePricePerKg).toFixed(2)])];

    // Send the formatted data to the frontend
    res.json(response);
  } catch (error) {
    console.error("Error fetching commodity price trends:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handlePaymentTrends = async (req, res) => {
    const startDate = req.query.startDate; // Start date in YYYY-MM-DD format
    const endDate = req.query.endDate;     // End date in YYYY-MM-DD format
  
    if (!startDate || !endDate) {
      return res.status(400).send("Invalid date range provided");
    }
  
    const sql = `
      SELECT 
          DATE_FORMAT(b.billDate, '%Y-%m') AS Month,
          SUM(IFNULL(p.paymentReceivedAmt, 0)) AS Received, -- Updated alias
          GREATEST(SUM(b.billPaymentAmount) - SUM(IFNULL(p.paymentReceivedAmt, 0)), 
                   ABS(SUM(b.billPaymentAmount) - SUM(IFNULL(p.paymentReceivedAmt, 0)))) AS Pending
      FROM 
          billdetails b
      LEFT JOIN 
          paymentdetails p 
          ON b.vendorId = p.vendorId AND DATE_FORMAT(b.billDate, '%Y-%m') = DATE_FORMAT(p.paymentDate, '%Y-%m')
      WHERE 
          b.billDate BETWEEN ? AND ?
      GROUP BY 
          Month
      ORDER BY 
          b.billDate;
    `;
  
    try {
      // Execute the SQL query
      const [rows] = await pool.promise().execute(sql, [startDate, endDate]);
  
      // If no data is returned, send an empty response
      if (rows.length === 0) {
        return res.json([["Month", "Received", "Pending"]]);
      }
  
      // Format the response for Google Charts
      const response = [["Month", "Received", "Pending"], ...rows.map(row => [row.Month, parseFloat(row.Received), parseFloat(row.Pending)])];
  
      // Send the formatted data to the frontend
      res.json(response);
    } catch (error) {
      console.error("Error fetching payment trends:", error);
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = { handleCommodityPriceTrends, handlePaymentTrends };
