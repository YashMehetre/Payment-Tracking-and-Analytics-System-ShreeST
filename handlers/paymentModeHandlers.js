const pool = require('../modules/database');

const handleAddPaymentModeData = async(req,res) =>{
    const data = req.body;
    let sql = `INSERT INTO paymentmode(paymentModeName, paymentModeDetails, paymentModeStatus) VALUES ("${data.paymentModeName}","${data.paymentModeDetails}","${data.paymentModeStatus}")`;
    try {
        await pool.promise().execute(sql,[
            data.paymentModeName,
            data.paymentModeDetails,
            data.paymentModeStatus
        ])
        res.render('addPaymentMode',{status:1});
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

module.exports = {handleAddPaymentModeData, handleFetchPaymentModes};