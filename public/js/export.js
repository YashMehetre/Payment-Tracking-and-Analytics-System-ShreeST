document.addEventListener("DOMContentLoaded", () => {
  const reportTypeSelect = document.getElementById("reportType");
  const vendorSection = document.querySelector(".selectVendor");
  const vendorSelect = document.getElementById("vendorFirmName");
  const generateReportBtn = document.getElementById("generateReportBtn");

  reportTypeSelect.addEventListener("change", async () => {
    const reportType = reportTypeSelect.value;

    if (reportType === "2" || reportType === "3") {
      vendorSection.style.display = "block";
      await populateVendorDropdown();
    } else {
      vendorSection.style.display = "none";
      vendorSelect.innerHTML = `<option value="">Select Vendor</option>`; // Reset vendors
    }
  });

  generateReportBtn.addEventListener("click", generateReport);

  async function fetchVendorsForSelect() {
    try {
      const response = await fetch("/fetchVendorsForSelect");
      if (!response.ok) throw new Error("Failed to fetch vendors");
      return await response.json();
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  async function populateVendorDropdown() {
    const vendors = await fetchVendorsForSelect();
    vendorSelect.innerHTML = `<option value="">Select Vendor</option>`; // Reset dropdown
    vendors.forEach(({ vendorId, vendorFirm }) => {
      const option = document.createElement("option");
      option.value = vendorId;
      option.textContent = vendorFirm;
      vendorSelect.appendChild(option);
    });
  }

  function generateReport() {
    const reportType = reportTypeSelect.value;
    const fromDate = document.getElementById("reportFromDate").value;
    const toDate = document.getElementById("reportToDate").value;
    const vendorFirmName = vendorSelect?.value || "";

    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    let url = `/showReport?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;

    if (reportType === "2") {
      url = `/showReport?reportType=${reportType}&vendorFirmName=${vendorFirmName}&fromDate=${fromDate}&toDate=${toDate}`;
    } else if (reportType === "3") {
      url = `/showReportType3?reportType=${reportType}&vendorFirmName=${vendorFirmName}&fromDate=${fromDate}&toDate=${toDate}`;
    } else if (reportType === "4") {
      url = `/showReportType4?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;
    } else if (reportType === "5") {
      url = `/showReportType5?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;
    }

    window.location.href = url;
  }
});
