const pool = require('../modules/database');

const handleFetchVendorsForSelect = async (req, res) => {
    let sql = `SELECT vendorId, vendorFirm FROM vendordetails`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
        console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const handleAddBillData = async (req, res) => {
    try {
        let data = req.body;
        let vendorId = await getVendorId(data.vendorFirmName);
        console.log(vendorId);
        let insertSql = `INSERT INTO billdetails(vendorId, billDate, billGoodsType, billTotalBoxes, billWeightPerBox, billTotalWeight, billMarketAmount, billPaymentAmount, billMoreDetails) VALUES (${vendorId},"${data.billDate}","${data.billGoodsType}",${data.billTotalBoxes},${data.billWeightPerBox},${data.billTotalWeight},${data.billMarketAmount},${data.billPaymentAmount},"${data.billMoreDetails}")`;

        await pool.promise().execute(insertSql, [
            vendorId,
            data.billDate,
            data.billGoodsType,
            data.billTotalBoxes,
            data.billWeightPerBox,
            data.billTotalWeight,
            data.billMarketAmount,
            data.billPaymentAmount,
            data.billMoreDetails
        ]);

        res.render('addBill',{status:"1"});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

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


module.exports = {handleFetchVendorsForSelect, handleAddBillData};