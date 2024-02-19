const pool = require('../modules/database');

const handleAddPaymentModeData = async(req,res) =>{
    const {paymentModeName, paymentModeStatus, paymentModeDetails} = req.body;
    let sql = `INSERT INTO paymentmode (paymentModeName, paymentModeStatus, paymentModeDetails) VALUES (?,?,?)`;
    try {
        const [result] = await pool.promise().execute(sql,[paymentModeName, paymentModeStatus, paymentModeDetails]);
        if(result.affectedRows === 1){
            res.json({status: 1, message: "Payment Mode Added Successfully"});
        }else{
            res.json({status: 0, message: "Failed to Add Payment Mode"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleFetchPaymentModes(req,res){
    let sql = `SELECT * FROM paymentmode`;
    try {
        const [result] = await pool.promise().execute(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleDeletePaymentMode(req,res){
    const {paymentModeId} = req.body;
    let sql = `DELETE FROM paymentmode WHERE paymentModeId = ?`;
    try {
        const [result] = await pool.promise().execute(sql,[paymentModeId]);
        if(result.affectedRows === 1){
            res.json({status: 1, message: "Payment Mode Deleted Successfully"});
        }else{
            res.json({status: 0, message: "Failed to Delete Payment Mode"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleUpdatePaymentMode(req,res){
    const {paymentModeId, paymentModeName, paymentModeStatus, paymentModeDetails} = req.body;
    let sql = `UPDATE paymentmode SET paymentModeName = ?, paymentModeStatus = ?, paymentModeDetails = ? WHERE paymentModeId = ?`;
    try {
        const [result] = await pool.promise().execute(sql,[paymentModeName, paymentModeStatus, paymentModeDetails, paymentModeId]);
        if(result.affectedRows === 1){
            res.json({status: 1, message: "Payment Mode Updated Successfully"});
        }else{
            res.json({status: 0, message: "Failed to Update Payment Mode"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleGetPaymentModeDetails(req,res){
    const {paymentModeId} = req.body;
    let sql = `SELECT * FROM paymentmode WHERE paymentModeId = ?`;
    try {
        const [result] = await pool.promise().execute(sql,[paymentModeId]);
        res.json(result[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handlePaymentModeIdConversion(req,res){
    let sql = `SELECT paymentModeId, paymentModeName FROM paymentmode`;
    try {
        const [result] = await pool.promise().execute(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {handlePaymentModeIdConversion,handleAddPaymentModeData, handleFetchPaymentModes,handleDeletePaymentMode,handleUpdatePaymentMode,handleGetPaymentModeDetails};