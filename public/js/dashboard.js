// Load Google Charts library
google.charts.load('current', { packages: ['corechart', 'bar'] });

document.addEventListener("DOMContentLoaded", function () {
    // Automatically set the date range from 1 April 2024 to today
    const startDate = "2024-04-01";
    const today = new Date().toISOString().split("T")[0];

    google.charts.setOnLoadCallback(() => {
        drawCommodityPriceTrends(startDate, today);
        drawPaymentTrends(startDate, today);
        // drawMarketDemandTrends(startDate, today);
        // drawSeasonalProfitability(startDate, today);
    });
});

// Fetch and draw Commodity Price Trends
async function drawCommodityPriceTrends(startDate, endDate) {
    const response = await fetch(`/commodityPriceTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    // Convert data for Google Charts
    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row;
        return [new Date(row[0] + "-01"), parseFloat(row[1])];
    });

    const data = google.visualization.arrayToDataTable(formattedData);
    const options = {
        title: "Commodity Price Trends",
        curveType: "function",
        legend: { position: "bottom" },
        height: 400,
        width: "100%",
        hAxis: { title: "Month", format: "MMM yyyy" },
        vAxis: { title: "Price (per kg)" },
    };

    const chart = new google.visualization.LineChart(document.getElementById("commodityPriceTrends"));
    chart.draw(data, options);
}

// Fetch and draw Payment Trends
async function drawPaymentTrends(startDate, endDate) {
    const response = await fetch(`/paymentTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row;
        return [new Date(row[0] + "-01"), parseFloat(row[1]), parseFloat(row[2])];
    });

    const data = google.visualization.arrayToDataTable(formattedData);
    const options = {
        title: "Payment Trends",
        isStacked: true,
        height: 400,
        width: "100%",
        hAxis: { title: "Month", format: "MMM yyyy" },
        vAxis: { title: "Amount (INR)" },
        seriesType: "bars",
        bar: { groupWidth: "75%" },
        colors: ["#4caf50", "#ff0000"],
    };

    const chart = new google.visualization.ComboChart(document.getElementById("paymentTrends"));
    chart.draw(data, options);
}

// Fetch and draw Market Demand Trends
async function drawMarketDemandTrends(startDate, endDate) {
    const response = await fetch(`/marketDemandTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row;
        return [new Date(row[0] + "-01"), parseFloat(row[1])];
    });

    const data = google.visualization.arrayToDataTable(formattedData);
    const options = {
        title: "Market Demand Trends",
        hAxis: { title: "Month" },
        vAxis: { title: "Demand" },
        height: 400,
        width: "100%",
    };

    const chart = new google.visualization.LineChart(document.getElementById("marketDemandTrends"));
    chart.draw(data, options);
}

// Fetch and draw Seasonal Profitability
async function drawSeasonalProfitability(startDate, endDate) {
    const response = await fetch(`/seasonalProfitabilityTrends?startDate=${startDate}&endDate=${endDate}`);
    const rawData = await response.json();

    const formattedData = rawData.map((row, index) => {
        if (index === 0) return row;
        return [new Date(row[0] + "-01"), parseFloat(row[1])];
    });

    const data = google.visualization.arrayToDataTable(formattedData);
    const options = {
        title: "Seasonal Profitability",
        height: 400,
        width: "100%",
        legend: { position: "none" },
        bars: "vertical",
    };

    const chart = new google.visualization.BarChart(document.getElementById("seasonalProfitability"));
    chart.draw(data, options);
}
