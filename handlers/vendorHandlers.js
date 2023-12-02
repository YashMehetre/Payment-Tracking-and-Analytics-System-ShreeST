// const conn = require('../modules/database');

// // Handler Functions

// async function handleFetchVendors(req,res){
//   let sql = `SELECT * FROM vendordetails`;
//   try {
//     conn.query(sql, function(err, result){
//       if(err){
//           throw err;
//       }
//       res.json(result);
//     })
//   } catch (error) {
//       console.log(error);
//   }
  
// }


// async function handleAddVendors(req,res){
//   const vendors = req.body;
//   console.log(vendors);
//   let sql = `INSERT INTO vendordetails(vendorFirm, vendorName, firmGSTNum, vendorContact1, vendorContact2,  vendorEmail, vendorAddress,  goodsType) VALUES ("${vendors.vendorFirm}","${ vendors.vendorName}","${ vendors.firmGSTNum}","${vendors.vendorContact1}","${vendors.vendorContact2}","${ vendors.vendorEmail}","${ vendors.vendorAddress}","${ vendors.goodsType}")`;
//   try {
//     conn.query(sql, function(err){
//       if(err){
//           throw err;
//       }
//       res.render('addVendor',{status:"1"});
//     })
//   } catch (error) {
//       console.log(error);
//   }
// }

// module.exports = {handleFetchVendors, handleAddVendors}

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
    const vendors = req.body;
    console.log(vendors);
    let sql = `INSERT INTO vendordetails(vendorFirm, vendorName, firmGSTNum, vendorContact1, vendorContact2,  vendorEmail, vendorAddress,  goodsType) VALUES ("${vendors.vendorFirm}","${ vendors.vendorName}","${ vendors.firmGSTNum}","${vendors.vendorContact1}","${vendors.vendorContact2}","${ vendors.vendorEmail}","${ vendors.vendorAddress}","${ vendors.goodsType}")`;

    try {
        await pool.promise().execute(sql, [
            vendors.vendorFirm,
            vendors.vendorName,
            vendors.firmGSTNum,
            vendors.vendorContact1,
            vendors.vendorContact2,
            vendors.vendorEmail,
            vendors.vendorAddress,
            vendors.goodsType
        ]);

        res.render('addVendor', { status: "1" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleFetchVendors, handleAddVendors };
