window.onload = async () => {
  await showVendorMasterReport();
  searchVendorFirm();
};

const generateReportHandler = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reportType = urlParams.get("reportType");
  const fromDate = urlParams.get("fromDate");
  const toDate = urlParams.get("toDate");
  const url = `/generateReport?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;
  const response = await fetch(url);
  return await response.json();
};

const colorProfitLoss = () => {
  const col = document.querySelectorAll("td:nth-child(7)");
  col.forEach((e) => {
    const value = parseFloat(e.innerText.replace(/[^0-9.-]+/g, "")) || 0;
    e.style.color = value < 0 ? "red" : "green";
  });
};

const showVendorMasterReport = async () => {
  try {
    const data = await generateReportHandler();

    // Formatter for Indian-style number grouping
    const formatter = new Intl.NumberFormat("en-IN");

    // ✅ Reset total variables before summing
    let totalBoxes = 0;
    let totalWeight = 0;
    let totalMarketAmount = 0;
    let totalPartyAmount = 0;
    let totalProfitLoss = 0;

    const tableBody = document.getElementById("data-table-table");
    const tableFoot = document.querySelector("#table tfoot");

    tableBody.innerHTML = ""; // ✅ Clear previous table rows
    tableFoot.innerHTML = ""; // ✅ Clear previous total row

    data.forEach((e) => {
      // ✅ Convert values to numbers and handle missing/null values
      let boxes = parseFloat((e.totalBoxes || "0").toString().replace(/,/g, "")) || 0;
      let weight = parseFloat((e.totalWeight || "0").toString().replace(/,/g, "")) || 0;
      let marketAmount = parseFloat((e.marketAmount || "0").toString().replace(/,/g, "")) || 0;
      let partyAmount = parseFloat((e.paymentAmount || "0").toString().replace(/,/g, "")) || 0;
      let profitLoss = parseFloat((e.profitLoss || "0").toString().replace(/,/g, "")) || 0;

      // ✅ Sum up totals
      totalBoxes += boxes;
      totalWeight += weight;
      totalMarketAmount += marketAmount;
      totalPartyAmount += partyAmount;
      totalProfitLoss += profitLoss;

      // ✅ Create and append row for each vendor
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="vendorId">${e.vendorId}</td>
        <td class="vendorFirm">${e.vendorFirm}</td>
        <td class="totalBoxes">${formatter.format(boxes)}</td>
        <td class="totalWeight">${formatter.format(weight)}</td>
        <td class="marketAmount">${formatter.format(marketAmount)}</td>
        <td class="partyAmount">${formatter.format(partyAmount)}</td>
        <td class="profitLoss">${formatter.format(profitLoss)}</td>
      `;
      tableBody.appendChild(row);
    });

    // ✅ Create and append the total row
    const totalRow = document.createElement("tr");
    totalRow.classList.add("table-success"); // ✅ Bootstrap green background
    totalRow.style.fontWeight = "bold";

    totalRow.innerHTML = `
      <td colspan="2" style="text-align:center;">Total:</td>
      <td>${formatter.format(totalBoxes)}</td>
      <td>${formatter.format(totalWeight)}</td>
      <td>${formatter.format(totalMarketAmount)}</td>
      <td>${formatter.format(totalPartyAmount)}</td>
      <td>${formatter.format(totalProfitLoss)}</td>
    `;

    tableFoot.appendChild(totalRow); // ✅ Append total row

    colorProfitLoss(); // ✅ Apply color formatting

  } catch (error) {
    console.error("Error loading report:", error);
  }
};

function searchVendorFirm() {
  const searchInput = document.getElementById("searchInput");
  const table = document.getElementById("table");
  const rows = table.getElementsByTagName("tr");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    Array.from(rows).forEach((row, index) => {
      if (index > 0 && index < rows.length - 1) {
        // Exclude the header row and the last row (sum row)
        const vendorFirm = row.cells[1].innerText.toLowerCase();
        row.style.display = vendorFirm.includes(searchTerm) ? "" : "none";
      }
    });
  });
}

function exportToPDF() {
  const tableContainer = document.getElementById("data-table");
  const reportDetails = document.getElementById("reportDetails");
  let filename = `${Date.now()}`;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const win = iframe.contentWindow.document;
  win.write("<html><head>");
  win.write(`<title>${filename}</title>`);
  win.write('<meta charset="utf-8">');
  win.write(
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
  );
  win.write("<style>");
  win.write("@media print {");
  win.write("  @page { size: landscape; margin: 0mm; }");
  win.write("  table { page-break-inside: auto; }");
  win.write("  tr { page-break-inside: avoid; }");
  win.write("}");
  win.write("body{padding:20px;}");
  win.write("</style>");
  win.write(
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
  );
  win.write("</head>");
  win.write("<body>");
  win.write("<br>");
  win.write(reportDetails.innerHTML);
  win.write("<br>");
  win.write("<hr>");
  win.write(tableContainer.innerHTML);
  win.write("<br>");
  win.write("</body></html>");
  win.close();

  iframe.contentWindow.print();
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}

function exportToXLSX() {
  const tableContainer = document.getElementById("table-responsive");
  const date = new Date();
  let filename = `${date.getFullYear()}-${date.getMonth() + 1
    }-${date.getDate()}`;
  const wb = XLSX.utils.table_to_book(tableContainer, { sheet: filename });
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
