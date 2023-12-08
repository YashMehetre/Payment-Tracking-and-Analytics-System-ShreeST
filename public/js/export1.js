document.addEventListener("DOMContentLoaded", () => {
    showLoadingReport();
    const time = setTimeout(() => loadSum(), 1000);
});

function loadSum() {
    // Get all rows in the table body
    const tableBody = document.querySelector("tfoot");
    const rows = tableBody.getElementsByTagName("tr");

    // Initialize sum variables
    let sumBoxes = 0;
    let sumBoxWt = 0;
    let sumTotalWeight = 0;
    let sumMarketAmount = 0;
    let sumPartyAmount = 0;

    // Loop through each row and sum the values
    for (let i = 0; i < rows.length; i++) { // Exclude the last row (sum row)
        const cells = rows[i].getElementsByTagName("td");
        sumBoxes += parseInt(cells[4].innerText) || 0;
        sumBoxWt += parseInt(cells[5].innerText) || 0;
        sumTotalWeight += parseInt(cells[6].innerText) || 0;
        sumMarketAmount += parseInt(cells[7].innerText) || 0;
        sumPartyAmount += parseInt(cells[8].innerText) || 0;
    }

    // Update the sum row with the calculated values
    document.getElementById("sumBoxes").innerText = sumBoxes;
    document.getElementById("sumBoxWt").innerText = sumBoxWt + " kg";
    document.getElementById("sumTotalWeight").innerText = sumTotalWeight + " kg";
    document.getElementById("sumMarketAmount").innerText = sumMarketAmount;
    document.getElementById("sumPartyAmount").innerText = sumPartyAmount;

    // Display the sum row
    document.getElementById("sumRow").style.display = "table-row";
    searchVendorFirm();
   
}
const fetchLoadingReport = async() =>{ 
    const response = await fetch('/fetchLoadingReport');
    const data = await response.json();
    return data;
}

async function showLoadingReport(){
    const data = await fetchLoadingReport();
    data.forEach(e => {
        const row = document.createElement('tr');
        row.innerHTML = `<tr>
        <td>${e.billNum}</td>
        <td>${e.billDate}</td>
        <td>${e.billNum}</td>
        <td>${e.vendorId}</td>
        <td>${e.billTotalBoxes}</td>
        <td>${e.billWeightPerBox}</td>
        <td>${e.billTotalWeight}</td>
        <td>${e.billMarketAmount}</td>
        <td>${e.billPaymentAmount}</td>
        <td>${e.billMoreDetails}</td>
        </tr>`
        // console.log(row);
        document.getElementById("data-table-table").appendChild(row);
    });
}


// Search functionality function
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
    console.log(tableContainer);
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