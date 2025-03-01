var express = require("express");

var router = express.Router();

const {
  handleFetchVendors,
  handleAddVendors,
  handleGetVendorDetails,
  handleUpdateVendorDetails,
  handleDeleteVendorDetails,
  handleVendorIdConversion,
} = require("../handlers/vendorHandlers");

const {
  handleFetchVendorsForSelect,
  handleAddBillData,
  handleGetLastBillNum,
  handleFetchLastBillData,
  handleSearchBillData,
  handleDeleteBillDetails,
  handleFetchBillData,
  handleUpdateBillData,
  handleFetchLastBillDate,
} = require("../handlers/billHandlers");

const {
  handleAddPaymentModeData,
  handleFetchPaymentModes,
  handleDeletePaymentMode,
  handleUpdatePaymentMode,
  handleGetPaymentModeDetails,
  handlePaymentModeIdConversion,
} = require("../handlers/paymentModeHandlers");

const {
  handleAddPaymentData,
  handleFetchPaymentModesForSelect,
  handleFetchPaymentDetails,
  handleFetchLastTenPaymentDetails,
  handleSearchPaymentData,
  handleDeletePaymentDetails,
  handleFetchLastPaymentDate,
} = require("../handlers/addPaymentHandlers");

const {
  generateReportHandler,
  handleAddBillPaymentAmount,
} = require("../handlers/exportHandlers");

const { handleLogout } = require("../handlers/dashboardHandlers");

const {
  handleCommodityPriceTrends,
  handlePaymentTrends,
} = require("../handlers/analyticsHandlers");

const {
  handleSendTemplateMessage,
  handleSendPendingPartyAmountMessage,
} = require("../handlers/wp-notificationHandlers");
/* GET home page. */
router.get("/dashboard", function (req, res, next) {
  res.render("dashboard", { title: "Dashboard" });
});
router.get("/addVendor", function (req, res, next) {
  res.render("addVendor", { title: "Add Vendor" });
});
router.get("/viewData", function (req, res, next) {
  res.render("viewData", { title: "View Data" });
});
router.get("/analytics", function (req, res, next) {
  res.render("analytics", { title: "Analytics" });
});

// Default Routing

router.get("/addPayment", function (req, res, next) {
  res.render("addPayment", { title: "Add Payment" });
});
router.get("/editData", function (req, res, next) {
  res.render("editData", { title: "Edit Data" });
});
router.get("/profile", function (req, res, next) {
  res.render("profile", { title: "Profile" });
});
router.get("/table", function (req, res, next) {
  res.render("table", { title: "Table" });
});
router.get("/blank", function (req, res, next) {
  res.render("blank", { title: "Blank Page" });
});
router.get("/icons", function (req, res, next) {
  res.render("icons", { title: "Icons" });
});
router.get("/pratik", function (req, res, next) {
  res.render("pratik", { name: "Yash" });
});
router.get("/addBill", function (req, res, next) {
  res.render("addBill", { title: "Add Bill" });
});
router.get("/addPaymentMode", function (req, res, next) {
  res.render("addPaymentMode", { title: "Add Payment Mode" });
});
router.get("/export", function (req, res, next) {
  res.render("export", { title: "Export" });
});

// Routes using handler functions
// Dashboard Module
router.post("/logout", handleLogout);

// Vendors Module
router.get("/fetchVendors", handleFetchVendors);
router.post("/addVendorData", handleAddVendors);
router.post("/deleteVendorDetails", handleDeleteVendorDetails);
router.post("/getVendorDetails", handleGetVendorDetails);
router.post("/updateVendorDetails", handleUpdateVendorDetails);
router.get("/vendorIdConversion", handleVendorIdConversion);

//Add Bill Module
router.get("/fetchVendorsForSelect", handleFetchVendorsForSelect);
router.post("/addBillData", handleAddBillData);
router.get("/getLastBillNum", handleGetLastBillNum);
router.get("/fetchLastBillData", handleFetchLastBillData);
router.get("/searchBillData", handleSearchBillData);
router.get("/deleteBillDetails", handleDeleteBillDetails);
router.get("/fetchBillData", handleFetchBillData);
router.post("/updateBillData", handleUpdateBillData);
router.get("/fetchLastBillDate", handleFetchLastBillDate);

// Add Payment Mode Module
router.get("/fetchPaymentModes", handleFetchPaymentModes);
router.post("/addPaymentModeData", handleAddPaymentModeData);
router.post("/deletePaymentMode", handleDeletePaymentMode);
router.post("/updatePaymentMode", handleUpdatePaymentMode);
router.post("/getPaymentModeDetails", handleGetPaymentModeDetails);
router.get("/paymentModeIdConversion", handlePaymentModeIdConversion);

// Add Payment Module
router.post("/addPaymentData", handleAddPaymentData);
router.get("/fetchPaymentModesForSelect", handleFetchPaymentModesForSelect);
router.get("/fetchPaymentDetails", handleFetchPaymentDetails);
router.get("/fetchLastTenPaymentDetails", handleFetchLastTenPaymentDetails);
router.post("/searchPaymentData", handleSearchPaymentData);
router.post("/deletePaymentDetails", handleDeletePaymentDetails);
router.get("/fetchLastPaymentDate", handleFetchLastPaymentDate);

// Export Data Module

router.get("/generateReport", generateReportHandler);

router.get("/showReport", function (req, res) {
  res.render("showReport", {
    title: `${
      req.query.reportType == 2
        ? "Vendorwise Loading Report"
        : req.query.reportType == 2
        ? "Loading Vendor Deposit/Pending Amount Report"
        : "Loading Report"
    }`,
    fromDate: `${req.query.fromDate}`,
    toDate: `${req.query.toDate}`,
    vendorFirmName: `${
      req.query.reportType == 1 ? "All" : req.query.vendorFirmName
    }`,
  });
});
router.get("/addBillPaymentAmount", handleAddBillPaymentAmount);
router.get("/showReportType3", function (req, res) {
  res.render("showReport3", {
    title: `${
      req.query.reportType == 2
        ? "Vendorwise Loading Report"
        : req.query.reportType == 3
        ? "Loading Vendor Deposit/Pending Amount Report"
        : "Loading Report"
    }`,
    fromDate: `${req.query.fromDate}`,
    toDate: `${req.query.toDate}`,
    vendorFirmName: `${
      req.query.reportType == 1 ? "All" : req.query.vendorFirmName
    }`,
  });
});
router.get("/showReportType4", function (req, res) {
  res.render("showReport4", {
    title: "Vendor Master Report",
    fromDate: `${req.query.fromDate}`,
    toDate: `${req.query.toDate}`,
    vendorFirmName: "All",
  });
});

// Analytics Module

router.get("/commodityPriceTrends", handleCommodityPriceTrends);

router.get("/paymentTrends", handlePaymentTrends);

router.get("/marketDemandTrends", function (req, res) {
  res.json([
    ["Date", "Demand"],
    ["2023-01", 300],
    ["2023-02", 350],
    ["2023-03", 400],
    ["2023-04", 450],
    ["2023-05", 500],
  ]);
});

router.get("/seasonalProfitabilityTrends", function (req, res) {
  res.json([
    ["Month", "Profit"],
    ["2023-01", 300],
    ["2023-02", 350],
    ["2023-03", 400],
    ["2023-04", 450],
    ["2023-05", 500],
  ]);
});

router.post("/sendTemplateMessage", handleSendTemplateMessage);
router.post(
  "/sendPendingPartyAmountMessage",
  handleSendPendingPartyAmountMessage
);
module.exports = router;
