var express = require('express');
var router = express.Router();

const { handleFetchVendors, handleAddVendors } = require('../handlers/vendorHandlers');
const { handleFetchVendorsForSelect, handleAddBillData } = require('../handlers/billHandlers');
const {handleAddPaymentModeData, handleFetchPaymentModes} = require('../handlers/paymentModeHandlers');
const {addPaymentDataHandler,handleFetchPaymentModesForSelect} = require('../handlers/addPaymentHandlers');
const {addReportGenerationParamsHandler,fetchLoadingReportHandler} = require('../handlers/exportHandlers');

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
router.get('/export1', function(req, res, next) {
  res.render('export1', { title: 'Loading Report',vendorFirmName:'Yash Traders',fromDate:'2023-06-08',toDate:'2023-06-08'});
});

// Routes using handler functions

// Vendors Module
router.get('/fetchVendors', handleFetchVendors);
router.post('/addVendorData', handleAddVendors);


//Add Bill Module
router.get('/fetchVendorsForSelect',handleFetchVendorsForSelect);
router.post('/addBillData',handleAddBillData);

// Add Payment Mode Module
router.get('/fetchPaymentModes',handleFetchPaymentModes);
router.post('/addPaymentModeData',handleAddPaymentModeData);

// Add Payment Module
router.post('/addPaymentData',addPaymentDataHandler);
router.get('/fetchPaymentModesForSelect',handleFetchPaymentModesForSelect );

// Export Data Module

router.post('/addReportGenerationParams',addReportGenerationParamsHandler);
router.get('/fetchLoadingReport',fetchLoadingReportHandler )
module.exports = router;
