var express = require('express');
var router = express.Router();

const { handleFetchVendors, handleAddVendors } = require('../handlers/vendorHandlers');

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
router.get('/addBill', function(req, res, next) {
  res.render('addBill', { title: 'Add Bill' });
});
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



// Routes using handler functions

// Vendors Module
router.get('/fetchVendors', handleFetchVendors);
router.post('/addVendorData', handleAddVendors);



module.exports = router;
