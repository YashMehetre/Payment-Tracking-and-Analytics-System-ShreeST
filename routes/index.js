var express = require('express');
var router = express.Router();

const { handleFetchVendors, handleAddVendors, handleGetVendorDetails,handleUpdateVendorDetails,handleDeleteVendorDetails} = require('../handlers/vendorHandlers');
const { handleFetchVendorsForSelect, handleAddBillData, handleGetLastBillNum} = require('../handlers/billHandlers');
const {handleAddPaymentModeData, handleFetchPaymentModes} = require('../handlers/paymentModeHandlers');
const {addPaymentDataHandler,handleFetchPaymentModesForSelect} = require('../handlers/addPaymentHandlers');
const {generateReportHandler} = require('../handlers/exportHandlers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});
router.get('/addVendor', function(req, res, next) {
  res.render('addVendor', { title: 'Add Vendor' });
});
router.get('/viewData', function(req, res, next) {
  res.render('viewData', { title: 'View Data' });
});
router.get('/analytics', function(req, res, next) {
  res.render('analytics', { title: 'Analytics' });
});

// Default Routing

router.get('/addPayment', function(req, res, next) {
  res.render('addPayment', { title: 'Add Payment' });
});
router.get('/editData', function(req, res, next) {
  res.render('editData', { title: 'Edit Data' });
});
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});
router.get('/table', function(req, res, next) {
  res.render('table', { title: 'Table' });
});
router.get('/blank', function(req, res, next) {
  res.render('blank', { title: 'Blank Page' });
});
router.get('/icons', function(req, res, next) {
  res.render('icons', { title: 'Icons' });
});
router.get('/pratik', function(req, res, next) {
  res.render('pratik',{name:"Yash"});
});
router.get('/addBill', function(req, res, next) {
  res.render('addBill', { title: 'Add Bill' });
});
router.get('/addPaymentMode', function(req, res, next) {
  res.render('addPaymentMode', { title: 'Add Payment Mode' });
});
router.get('/export', function(req, res, next) {
  res.render('export', { title: 'Export' });
});


// Routes using handler functions

// Vendors Module
router.get('/fetchVendors', handleFetchVendors);
router.post('/addVendorData', handleAddVendors);
router.post('/deleteVendorDetails', handleDeleteVendorDetails);
router.post('/getVendorDetails', handleGetVendorDetails);
router.post('/updateVendorDetails', handleUpdateVendorDetails);


//Add Bill Module
router.get('/fetchVendorsForSelect',handleFetchVendorsForSelect);
router.post('/addBillData',handleAddBillData);
router.get('/getLastBillNum',handleGetLastBillNum);


// Add Payment Mode Module
router.get('/fetchPaymentModes',handleFetchPaymentModes);
router.post('/addPaymentModeData',handleAddPaymentModeData);

// Add Payment Module
router.post('/addPaymentData',addPaymentDataHandler);
router.get('/fetchPaymentModesForSelect',handleFetchPaymentModesForSelect );

// Export Data Module

router.get('/generateReport',generateReportHandler);
router.get('/showReport', function(req, res){
  res.render('showReport', { title: `${req.query.reportType==2?'Vendorwise Loading Report':req.query.reportType==2?'Loading Vendor Deposit/Pending Amount Report':'Loading Report'}`,fromDate :`${req.query.fromDate}`,
  toDate : `${req.query.toDate}`,
  vendorFirmName : `${req.query.reportType==1?'All':req.query.vendorFirmName}`});
});

module.exports = router;
