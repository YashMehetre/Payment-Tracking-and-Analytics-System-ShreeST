window.onload = async () => {
  await showVendorMasterReport();
  searchVendorFirm();
  setTimeout(() => loadSum(), 1000);
};

function loadSum() {
  const tableBody = document.querySelector("tbody");
  const rows = tableBody.getElementsByTagName("tr");
  let sumMarketAmount = 0;
  let sumPartyAmount = 0;
  let sumBoxes = 0;
  for (let i = 0; i < rows.length; i++) {
    let marketAmount = rows[i].cells[4].innerText;
    let partyAmount = rows[i].cells[5].innerText;
    let boxes = rows[i].cells[2].innerText;
    if (marketAmount != "-") {
      sumMarketAmount += parseInt(marketAmount.replace(/,/g, ""));
    }
    if (partyAmount != "-") {
      sumPartyAmount += parseInt(partyAmount.replace(/,/g, ""));
    }
    if (boxes != "-") {
      sumBoxes += parseInt(boxes.replace(/,/g, ""));
    }
  }
  document.getElementById("sumBoxes").innerText = sumBoxes.toLocaleString(
    "en-IN",
    { useGrouping: true }
  );
  document.getElementById("sumMarketAmount").innerText =
    sumMarketAmount.toLocaleString("en-IN", { useGrouping: true });
  document.getElementById("sumPartyAmount").innerText =
    sumPartyAmount.toLocaleString("en-IN", { useGrouping: true });
  document.getElementById("sumProfitLoss").innerText = `${(
    sumPartyAmount - sumMarketAmount
  ).toLocaleString("en-IN", { useGrouping: true })}`;
}

const generateReportHandler = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reportType = urlParams.get("reportType");
  const fromDate = urlParams.get("fromDate");
  const toDate = urlParams.get("toDate");
  const url = `/generateReport?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
const colorProfitLoss = () => {
  const col = document.querySelectorAll("td:nth-child(7)");
  col.forEach((e) => {
    const value = parseFloat(e.innerText.replace(/[^0-9.-]+/g, ""));
    if (value < 0) {
      e.style.color = "red";
    } else {
      e.style.color = "green";
    }
  });
};
const showVendorMasterReport = async () => {
  try {
    const data = await generateReportHandler();

    // Formatter for English grouping
    const formatter = new Intl.NumberFormat("en-IN");

    data.forEach((e) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <tr>
            <td class="vendorId">${e.vendorId}</td>
            <td class="vendorFirm">${e.vendorFirm}</td>
            <td class="totalBoxes">${formatter.format(e.totalBoxes)}</td>
            <td class="totalWeight">${formatter.format(e.totalWeight)}</td>
            <td class="marketAmount">${formatter.format(e.marketAmount)}</td>
            <td class="paymentAmount">${formatter.format(e.paymentAmount)}</td>
            <td class="profitLoss">${formatter.format(e.profitLoss)}</td>
          </tr>`;
      document.getElementById("data-table-table").appendChild(row);
    });

    colorProfitLoss();
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
  let filename = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const wb = XLSX.utils.table_to_book(tableContainer, { sheet: filename });
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
