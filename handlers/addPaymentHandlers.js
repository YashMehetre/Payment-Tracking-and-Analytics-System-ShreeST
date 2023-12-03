const pool = require('../modules/database');

const addPaymentDataHandler = async(req,res) =>{
    let data = req.body;
    console.log(data);
    let vendorId = await getVendorId(data.vendorFirmName);
    let paymentModeId = await getPaymentModeId(data.paymentModeName);
    let sql = `INSERT INTO paymentdetails(vendorId, paymentModeId, paymentDate, paymentReceivedAmt, paymentMoreDetails) VALUES (${vendorId},${paymentModeId},"${data.paymentDate}",${data.paymentReceivedAmt},"${data.paymentMoreDetails}")`;

    try {
        await pool.promise().execute(sql,[
            vendorId,
            paymentModeId,
            data.paymentDate,
            data.paymentReceivedAmt,
            data.paymentMoreDetails
        ]);
        res.render('addPayment',{status:1});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
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
async function getPaymentModeId(paymentModeName){
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

async function handleFetchPaymentModesForSelect(req,res){
    let sql = `SELECT paymentModeId, paymentModeName FROM paymentmode`;
    try {
        const [result] = await pool.promise().execute(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {addPaymentDataHandler,handleFetchPaymentModesForSelect};