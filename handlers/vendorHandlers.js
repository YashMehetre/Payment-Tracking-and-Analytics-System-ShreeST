// Description: It has handler functions for vendor related operations.

const pool = require('../modules/database');

async function handleFetchVendors(req, res) {
    let sql = `SELECT * FROM vendordetails`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleAddVendors(req, res) {
    let vendors = req.body;
    let sql = `INSERT INTO vendordetails(vendorFirm, vendorName, firmGSTNum, vendorContact1, vendorContact2,  vendorEmail, vendorAddress,  goodsType) VALUES ("${vendors.vendorFirm}","${vendors.vendorName}","${vendors.firmGSTNum}","${vendors.vendorContact1}","${vendors.vendorContact2}","${vendors.vendorEmail}","${vendors.vendorAddress}","${vendors.goodsType}")`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json({ status: 1 });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const handleGetVendorDetails = async (req, res) => {
    let vendorId = req.body.vendorId;
    let sql = `SELECT * FROM vendordetails WHERE vendorId = ${vendorId}`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleUpdateVendorDetails(req, res) {
    let data = req.body;
    let sql = `UPDATE vendordetails SET vendorFirm = "${data.vendorFirm}", vendorName = "${data.vendorName}", firmGSTNum = "${data.firmGSTNum}", goodsType = "${data.goodsType}", vendorContact1 = "${data.vendorContact1}", vendorAddress = "${data.vendorAddress}", vendorContact2 = "${data.vendorContact2}", vendorEmail = "${data.vendorEmail}" WHERE vendorId = ${data.vendorId}`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json({ status: 1 });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleDeleteVendorDetails(req, res) {
    let vendorId = req.body.vendorId;
    let sql = `DELETE FROM vendordetails WHERE vendorId = ${vendorId}`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json({ status: 1 });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
async function handleVendorIdConversion(req, res) {
    let sql = `SELECT vendorId, vendorFirm FROM vendordetails`;
    try {
        const [result] = await pool.promise().query(sql);
        res.json(result);
        // console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {handleVendorIdConversion, handleFetchVendors, handleAddVendors, handleGetVendorDetails, handleUpdateVendorDetails,handleDeleteVendorDetails };
