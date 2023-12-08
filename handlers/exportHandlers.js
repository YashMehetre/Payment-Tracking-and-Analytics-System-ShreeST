const pool = require("../modules/database");

async function addReportGenerationParamsHandler(req, res) {
  let data = req.body;
  if (data.reportType == 1) {
    res.render('export1',{ title: 'Loading Report',vendorFirmName:`${data.vendorFirmName}`,fromDate:`${data.reportFromDate}`,toDate:`${data.reportToDate}`})
  }
}
async function fetchLoadingReportHandler(req, res) {
    let sql = `SELECT * FROM billdetails`;
    try {
      const [result] = await pool
        .promise()
        .execute(sql);
      console.log(result);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }

module.exports = { addReportGenerationParamsHandler,fetchLoadingReportHandler };
