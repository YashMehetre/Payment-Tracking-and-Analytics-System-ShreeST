document.addEventListener("DOMContentLoaded", () => {
    showLoadingReport();
    setTimeout(() => loadSum(), 1000);
});

function loadSum() {
    const tableBody = document.querySelector("tbody");
    const rows = tableBody.getElementsByTagName("tr");

    let sumBoxes = 0;
    let sumTotalWeight = 0;
    let sumMarketAmount = 0;
    let sumPartyAmount = 0;
    let sumProfitLoss = 0;

    for (let i = 0; i < rows.length; i++) { // Exclude the last row (sum row)
        const cells = rows[i].getElementsByTagName("td");
        sumBoxes += parseInt(cells[3].innerText) || 0; // Assuming the index of total boxes is 3
        sumTotalWeight += parseFloat(cells[4].innerText.replace(" kg", "")) || 0; // Assuming the index of total weight is 4
        sumMarketAmount += parseFloat(cells[5].innerText.replace(/[^0-9.-]+/g, "")) || 0; // Assuming the index of market amount is 6
        sumPartyAmount += parseFloat(cells[6].innerText.replace(/[^0-9.-]+/g, "")) || 0; // Assuming the index of party amount is 7
        sumProfitLoss += parseFloat(cells[7].innerText.replace(/[^0-9.-]+/g, "")) || 0; // Assuming the index of profit loss is 8
    }

    document.getElementById("sumBoxes").innerText = sumBoxes.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("sumTotalWeight").innerText = sumTotalWeight.toLocaleString('en-IN', { useGrouping: true }) + " kg";
    document.getElementById("sumMarketAmount").innerText = sumMarketAmount.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("sumPartyAmount").innerText = sumPartyAmount.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("sumProfitLoss").innerText = sumProfitLoss.toLocaleString('en-IN', { useGrouping: true });

    document.getElementById("sumRow").style.display = "table-row";
}


const generateReportHandler = async () => {
    urlParams = new URLSearchParams(window.location.search);
    const reportType = urlParams.get('reportType');
    const vendorFirmName = urlParams.get('vendorFirmName') || "";
    const fromDate = urlParams.get('fromDate');
    const toDate = urlParams.get('toDate');

    let url = `/generateReport?reportType=${reportType}&fromDate=${fromDate}&toDate=${toDate}`;
    if (reportType != 1) {
        url = `/generateReport?reportType=${reportType}&vendorFirmName=${vendorFirmName}&fromDate=${fromDate}&toDate=${toDate}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function showLoadingReport() {
    try {
        const data = await generateReportHandler();
        data.forEach(e => {
            let billMarketAmount = parseFloat(e.billMarketAmount) || 0;
            let billPaymentAmount = parseFloat(e.billPaymentAmount) || 0;
            let profitLoss = billMarketAmount - billPaymentAmount;

            const row = document.createElement('tr');
            row.innerHTML = `<tr>
                <td>${e.billNum}</td>
                <td>${e.billDate}</td>
                <td>${e.vendorFirm}</td>
                <td>${e.billTotalBoxes}</td>
                <td>${e.billTotalWeight}</td>
                <td>${billMarketAmount.toLocaleString('en-IN', { useGrouping: true })}</td>
                <td>${billPaymentAmount.toLocaleString('en-IN', { useGrouping: true })}</td>
                <td class="${profitLoss >= 0 ? 'text-success' : 'text-danger'}">${profitLoss.toLocaleString('en-IN', { useGrouping: true })}</td>
                <td>${e.billMoreDetails}</td>
                </tr>`;
            document.getElementById("data-table-table").appendChild(row);
        });
    } catch (error) {
        console.error("Error loading report:", error);
    }
}


function searchVendorFirm() {
    const searchInput = document.getElementById("searchInput");
    const table = document.getElementById("table");
    const rows = table.getElementsByTagName("tr");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        Array.from(rows).forEach((row, index) => {
            if (index < rows.length - 1) { // Exclude the last row (sum row)
                const vendorFirm = row.cells[3].innerText.toLowerCase(); // Assuming Vendor Firm is in the fourth column
                row.style.display = vendorFirm.includes(searchTerm) ? "" : "none";
            }
        });
    });
}

function exportToPDF() {
    const tableContainer = document.getElementById('data-table');
    const reportDetails = document.getElementById('reportDetails');
    let filename = `${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const win = iframe.contentWindow.document;
    win.write('<html><head>');
    win.write(`<title>${filename}</title>`);
    win.write('<meta charset="utf-8">')
    win.write('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">')
    win.write('<style>');
    win.write('@media print {');
    win.write('  @page { size: landscape; margin: 0mm; }');
    win.write('  table { page-break-inside: auto; }');
    win.write('  tr { page-break-inside: avoid; }');
    win.write('}');
    win.write('body{padding:20px;}')
    win.write('</style>');
    win.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">');
    win.write('</head>');
    win.write('<body>');
    win.write('<br>')
    win.write(reportDetails.innerHTML);
    win.write('<br>')
    win.write('<hr>')
    win.write(tableContainer.innerHTML);
    win.write('<br>')
    win.write('</body></html>');
    win.close();

    iframe.contentWindow.print();
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
}

function exportToXLSX() {
    const tableContainer = document.getElementById('table-responsive');
    const date = new Date();
    let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const wb = XLSX.utils.table_to_book(tableContainer, { sheet: filename });
    XLSX.writeFile(wb, `${filename}.xlsx`);
}
