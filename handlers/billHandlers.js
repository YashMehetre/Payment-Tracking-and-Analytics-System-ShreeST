const pool = require('../modules/database');

const handleFetchVendorsForSelect = async (req, res) => {
    let sql = `SELECT vendorId, vendorFirm FROM vendordetails`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
        // console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const handleAddBillData = async (req, res) => {
    let billDate = req.body.billDate;
    let vendorFirmName = req.body.vendorFirmName;
    let billGoodsType = req.body.billGoodsType;
    let billTotalBoxes = req.body.billTotalBoxes;
    let billWeightPerBox = req.body.billWeightPerBox;
    let billTotalWeight = req.body.billTotalWeight;
    let billMarketAmount = req.body.billMarketAmount;
    let billPaymentAmount = req.body.billPaymentAmount;
    let billMoreDetails = req.body.billMoreDetails;
    let vendorId = await getVendorId(vendorFirmName);
    let sql = `INSERT INTO billdetails (billDate, vendorId, billGoodsType, billTotalBoxes, billWeightPerBox, billTotalWeight, billMarketAmount, billPaymentAmount, billMoreDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const [result] = await pool.promise().query(sql, [billDate, vendorId, billGoodsType, billTotalBoxes, billWeightPerBox, billTotalWeight, billMarketAmount, billPaymentAmount, billMoreDetails]);
        res.json({status: 1});
    }
    catch (error) {
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
const handleGetLastBillNum = async (req, res) => {
    let sql = `SELECT billNum FROM billdetails ORDER BY billNum DESC LIMIT 1`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

async function handleFetchLastBillData(req, res) {
    let limit = req.query.limit;
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId  ORDER BY billNum DESC LIMIT ${limit}`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleSearchBillData(req, res) {
    let vendorId = await getVendorId(req.query.vendorFirmName);
    let date = req.query.date;
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE billdetails.vendorId = ? AND billdetails.billDate = ?`;
    try {
        const [result] = await pool.promise().query(sql, [vendorId, date]);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    } 
}
async function handleDeleteBillDetails(req, res) {
    let billNum = req.query.billNum;
    let sql = `DELETE FROM billdetails WHERE billNum = ?`;
    try {
        const [result] = await pool.promise().query(sql, [billNum]);
        res.json({status: 1});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleFetchBillData(req, res) {
    let billNum = req.query.billNum;
    let sql = `SELECT billdetails.billNum, DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate, vendordetails.vendorFirm, billdetails.billGoodsType, billdetails.billTotalBoxes, billdetails.billWeightPerBox, billdetails.billTotalWeight, billdetails.billMarketAmount, billdetails.billPaymentAmount, billdetails.billMoreDetails FROM billdetails INNER JOIN vendordetails ON billdetails.vendorId = vendordetails.vendorId WHERE billdetails.billNum = ?`;
    try {
        const [result] = await pool.promise().query(sql, [billNum]);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleUpdateBillData(req, res) {
    let {billNum, billDate, billGoodsType, billTotalBoxes, billWeightPerBox, billTotalWeight, billMarketAmount, billPaymentAmount, billMoreDetails} = req.body;
    let sql = `UPDATE billdetails SET billDate = ?, billGoodsType = ?, billTotalBoxes = ?, billWeightPerBox = ?, billTotalWeight = ?, billMarketAmount = ?, billPaymentAmount = ?, billMoreDetails = ? WHERE billNum = ?`;
    try {
        const [result] = await pool.promise().query(sql, [billDate, billGoodsType, billTotalBoxes, billWeightPerBox, billTotalWeight, billMarketAmount, billPaymentAmount, billMoreDetails, billNum]);
        res.json({status: 1});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleFetchLastBillDate(req, res) {
    let sql = `SELECT DATE_FORMAT(billdetails.billDate, '%d-%m-%Y') as billDate FROM billdetails ORDER BY billdetails.billNum DESC LIMIT 1`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {handleSearchBillData,handleFetchVendorsForSelect, handleAddBillData, handleGetLastBillNum, handleFetchLastBillData, handleDeleteBillDetails, handleFetchBillData, handleUpdateBillData,handleFetchLastBillDate};