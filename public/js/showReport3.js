document.addEventListener("DOMContentLoaded", () => {
    showLoadingReport();
    setTimeout(() => loadSum(), 1000);
});

function loadSum() {
    const tableBody = document.querySelector("tbody");
    const rows = tableBody.getElementsByTagName("tr");
    let sumPayment = 0;
    let sumPending = 0;
    let sumBoxes = 0;
    for (let i = 0; i < rows.length; i++) {
        let payment = rows[i].cells[4].innerText;
        let pending = rows[i].cells[5].innerText;
        let boxes = rows[i].cells[3].innerText;
        if (payment!="-") {
            sumPayment += parseInt(payment.replace(/,/g, ""));
        }
        if (pending != "-") {
            sumPending += parseInt(pending.replace(/,/g, ""));
        }
        if (boxes != "-") {
            sumBoxes += parseInt(boxes);
        }
        
    }
    document.getElementById("totalBoxes").innerText = sumBoxes.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("totalPaymentAmount").innerText = sumPayment.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("totalPendingAmount").innerText = sumPending.toLocaleString('en-IN', { useGrouping: true });
    document.getElementById("finalPendingAmt").innerHTML = `Pending Amount = <span>&#8377;</span>${(sumPending - sumPayment).toLocaleString('en-IN', { useGrouping: true })}`;
}

const generateReportHandler = async () => {
    urlParams = new URLSearchParams(window.location.search);
    const reportType = urlParams.get('reportType');
    const vendorFirmName = urlParams.get('vendorFirmName') || "";
    const fromDate = urlParams.get('fromDate');
    const toDate = urlParams.get('toDate');
    url = `/generateReport?reportType=${reportType}&vendorFirmName=${vendorFirmName}&fromDate=${fromDate}&toDate=${toDate}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function showLoadingReport() {
    try {
        const data = await generateReportHandler();
        let index = 1;
        let type = "";
        data.forEach(e => {
            if(e.paymentAmount){
                type = "Pay";
                e.paymentAmount = e.paymentAmount.toLocaleString('en-IN', { useGrouping: true });
            }
            if(e.pendingAmount){
                type = "Bill";
                e.pendingAmount = e.pendingAmount.toLocaleString('en-IN', { useGrouping: true });
            }
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index}</td>
            <td>${type}Num : ${e.id}</td>
            <td>${e.date}</td>
            <td>${e.billTotalBoxes || "-"}</td>
            <td style="color:green">${e.paymentAmount || "-"}</td>
            <td style="color:red">${e.pendingAmount || "-"}</td>`;
            document.getElementById("data-table-table").appendChild(row);
            index++;
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
