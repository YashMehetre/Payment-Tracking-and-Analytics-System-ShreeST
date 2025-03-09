window.onload = () => {
    showMarkets();
};

document.getElementById("marketName").focus();

// ✅ Add New Market
async function addMarket() {
    const marketName = document.getElementById("marketName").value;
    const marketLocation = document.getElementById("marketLocation").value;
    const marketGST = document.getElementById("marketGST").value || "";
    const marketStatus = document.getElementById("marketStatus").value;

    const response = await fetch("/addMarket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketName, marketLocation, marketGST, marketStatus }),
    });

    const data = await response.json();
    if (data.status === 1) {
        alert("Market Added Successfully");
        location.reload();
    } else {
        alert("Failed to Add Market");
    }
}

// ✅ Fetch All Markets
const fetchMarkets = async () => {
    const response = await fetch("/fetchMarkets");
    return response.json();
};

// ✅ Display Markets in Table
async function showMarkets() {
    const data = await fetchMarkets();
    const tableBody = document.querySelector(".markets");
    tableBody.innerHTML = ""; // Clear previous entries

    data.forEach((market) => {
        const row = document.createElement("tr");
        const statusText = market.marketStatus === "Active"
            ? `<p style="color: rgb(11, 196, 11);">Active</p>`
            : `<p style="color:red;">Inactive</p>`;

        row.innerHTML = `
            <td>${market.marketId}</td>
            <td>${market.marketName}</td>
            <td>${market.marketLocation}</td>
            <td>${market.marketGST || "N/A"}</td>
            <td>${statusText}</td>
            <td>
                <button class="btn btn-primary" onclick="editMarket(${market.marketId})">Edit</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// ✅ Fetch Single Market Details
async function fetchMarketDetails(marketId) {
    const response = await fetch(`/getMarketDetails/${marketId}`);  // ✅ Fixed API Call (GET)
    return response.json();
}

// ✅ Edit Market - Fill Form with Existing Data
async function editMarket(marketId) {
    const data = await fetchMarketDetails(marketId);
    scrollToTop();
    document.getElementById("updateDetailsTitle").style.display = "";
    document.getElementById("marketName").value = data.marketName;
    document.getElementById("marketLocation").value = data.marketLocation;
    document.getElementById("marketGST").value = data.marketGST || "";
    document.getElementById("marketStatus").value = data.marketStatus;

    document.getElementById("addDetailsBtn").style.display = "none";
    document.getElementById("updateDetailsBtn").style.display = "";
    document.getElementById("updateDetailsBtn").setAttribute("onclick", `updateMarket(${marketId})`);
}

// ✅ Update Market Details
async function updateMarket(marketId) {
    const marketName = document.getElementById("marketName").value;
    const marketLocation = document.getElementById("marketLocation").value;
    const marketGST = document.getElementById("marketGST").value;
    const marketStatus = document.getElementById("marketStatus").value;

    const response = await fetch("/updateMarket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketId, marketName, marketLocation, marketGST, marketStatus }),
    });

    const data = await response.json();
    if (data.status === 1) {
        alert("Market Updated Successfully");
        location.reload();
    } else {
        alert("Failed to Update Market");
    }
}

function cancelUpdateDetails() {
    if (confirm("Are you sure you want to cancel?")) location.reload();
}

function scrollToTop() {
    window.scrollTo(0, 0);
}
function scrollToTable() {
    window.scrollTo(0, document.body.scrollHeight);
}
