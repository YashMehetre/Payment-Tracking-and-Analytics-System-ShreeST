
// Ensure the Google Charts library is loaded before executing chart drawing functions
google.charts.load('current', {packages: ['corechart', 'bar']});

document.getElementById('showAnalytics').addEventListener('click', function() {
    // Get start and end month and year from the input fields
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate === '' || endDate === '') {
        alert('Please select start and end date');
        return;
    }
    console.log(startDate, endDate);
    
    document.querySelector('.analytics').style.display = 'block';
    google.charts.setOnLoadCallback(drawCharts (startDate, endDate));
    // // Attach event listener for window resize to redraw charts
    // window.addEventListener('resize', drawCharts(startDate, endDate));
});


// Function to draw all charts
function drawCharts(startDate, endDate) {
    drawCommodityPriceTrends(startDate, endDate);
    drawPaymentTrends(startDate, endDate);
    drawMarketDemandTrends(startDate, endDate);
    drawSeasonalProfitability(startDate, endDate);
}

async function fetchCommodityPriceTrends(startDate, endDate) {
    const response = await fetch(`/commodityPriceTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    // Convert raw data to proper format for Google Charts
    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row; // Keep header as-is
        // Convert the month string (e.g. '2024-04') to a Date object for Google Charts
        const monthDate = new Date(row[0] + "-01"); // Appending '01' to make it a valid date
        return [monthDate, parseFloat(row[1])]; // Convert Price to a number
    });

    return formattedData;
}

async function drawCommodityPriceTrends(startDate, endDate) {
    const response = await fetchCommodityPriceTrends(startDate, endDate);

    // Convert response to DataTable for Google Charts
    var data = google.visualization.arrayToDataTable(response);

    var options = {
        title: 'Commodity Price Trends (Pomegranate)',
        curveType: 'function',
        legend: { position: 'bottom' },
        height: 400,
        width: '100%',
        hAxis: { title: 'Month', format: 'MMM yyyy' }, // Format for months and year
        vAxis: { title: 'Price (per kg)' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('commodityPriceTrends'));
    chart.draw(data, options);
}


// Fetch Payment Trends from the backend
async function fetchPaymentTrends(startDate, endDate) {
    const response = await fetch(`/paymentTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    // Convert raw data to a proper format for Google Charts
    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row; // Keep header as-is
        // Convert the month string (e.g. '2024-04') to a Date object for Google Charts
        const monthDate = new Date(row[0] + "-01"); // Append '01' to the month for valid date format
        return [monthDate, parseFloat(row[1]), parseFloat(row[2])]; // Paid and Pending as numbers
    });

    return formattedData;
}

// Draw the Payment Trends chart
async function fetchPaymentTrends(startDate, endDate) {
    const response = await fetch(`/paymentTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    // Convert raw data to proper format for Google Charts
    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row; // Keep header as-is
        const [year, month] = row[0].split("-"); // Split 'YYYY-MM' into year and month
        return [new Date(year, month - 1), parseFloat(row[1]), parseFloat(row[2])];
    });

    return formattedData;
}

function drawPaymentTrends(startDate, endDate) {
    fetchPaymentTrends(startDate, endDate).then(data => {
        // Initialize the chart with formatted data
        const chartData = google.visualization.arrayToDataTable(data);

        // Create a formatter for Indian Rupee format
        const currencyFormatter = new google.visualization.NumberFormat({
            prefix: '₹', // Indian Rupee symbol
            groupingSymbol: ',', // Use commas for thousands
            fractionDigits: 0 // No decimals
        });

        // Format the "Received" and "Pending" columns
        currencyFormatter.format(chartData, 1); // Apply to 'Received' column
        currencyFormatter.format(chartData, 2); // Apply to 'Pending' column

        // Set chart options
        const options = {
            title: 'Payment Trends',
            isStacked: true,
            height: 400,
            width: '100%',
            hAxis: {
                title: 'Month',
                format: 'MMM yyyy' // Properly format the dates
            },
            vAxis: {
                title: 'Amount (INR)' // Label for the vertical axis
            },
            seriesType: 'bars',
            bar: { groupWidth: '75%' },
            colors: ['#4caf50', '#ff0000'] // Example colors for 'Received' and 'Pending'
        };

        // Render the chart
        const chart = new google.visualization.ComboChart(document.getElementById('paymentTrends'));
        chart.draw(chartData, options);
    }).catch(error => {
        console.error("Error fetching payment trends:", error);
    });
}

async function fetchMarketDemandTrends(startDate, endDate) {
    const response = await fetch(`/marketDemandTrends?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}
function drawMarketDemandTrends( startDate, endDate) {
    var data = google.visualization.arrayToDataTable([
        ['Date', 'Demand'],
        ['2023-01', 300],
        ['2023-02', 350],
        ['2023-03', 400],
        ['2023-04', 450],
        ['2023-05', 500]
    ]);

    var options = {
        title: 'Market Demand Trends',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Demand' },
        height: 400,
        width: '100%'
    };

    var chart = new google.visualization.LineChart(document.getElementById('marketDemandTrends'));
    chart.draw(data, options);
}

async function fetchSeasonalProfitabilityTrends(startDate, endDate) {
    const response = await fetch(`/seasonalProfitabilityTrends?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}
function drawSeasonalProfitability(startDate, endDate) {
    var data = google.visualization.arrayToDataTable([
        ['Month', 'Profit'],
        ['2023-01', 5000],
        ['2023-02', 6000],
        ['2023-03', 7000],
        ['2023-04', 8000],
        ['2023-05', 7500]
    ]);

    var options = {
        title: 'Seasonal Profitability',
        height: 400,
        width: '100%',
        legend: { position: 'none' },
        bars: 'vertical'
    };

    var chart = new google.visualization.BarChart(document.getElementById('seasonalProfitability'));
    chart.draw(data, options);
}


