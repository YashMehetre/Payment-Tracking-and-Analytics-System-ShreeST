// Purpose: To handle the functionality of the vendors page.

window.onload = () => {
    fetchVendors();
    searchVendorFirm();
  };
document.getElementById("submitDetailsBtn").addEventListener("click", addVendorDetails);
document.getElementById("vendorFirm").focus();

// Add Vendor Details
async function addVendorDetails(){
    const vendorFirm = document.getElementById("vendorFirm").value;
    const vendorName = document.getElementById("vendorName").value;
    const firmGSTNum = document.getElementById("firmGSTNum").value;
    const goodsType = document.getElementById("goodsType").value;
    const vendorContact1 = document.getElementById("vendorContact1").value;
    const vendorAddress = document.getElementById("vendorAddress").value;
    const vendorContact2 = document.getElementById("vendorContact2").value ;
    const vendorEmail = document.getElementById("vendorEmail").value;
    if(vendorFirm === "" || vendorName === "" || goodsType === "" || vendorContact1 === ""){
        alert("Please fill all the details");
        return;
    }
    const response = await fetch('/addVendorData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            vendorFirm: vendorFirm,
            vendorName: vendorName,
            firmGSTNum: firmGSTNum,
            goodsType: goodsType,
            vendorContact1: vendorContact1,
            vendorAddress: vendorAddress,
            vendorContact2: vendorContact2,
            vendorEmail: vendorEmail
        })
    });
    const data = await response.json();
    console.log(data);
    if(data.status === 1){
        alert("Vendor Details Added Successfully");
        location.reload();
    }else{
        alert("Failed to Add Vendor Details");
    }
}

async function fetchVendors(){
    const response = await fetch('/fetchVendors');
    const data = await response.json();
    // console.log(data);
    showVendors(data);
}

function showVendors(data){
    data.forEach(e => {
        let row = document.createElement('tr')
         row.innerHTML =  `<tr>
            <td>${e.vendorId}</td>
            <td>${e.vendorFirm}</td>
            <td>${e.vendorName}</td>
            <td>${e.firmGSTNum}</td>
            <td>${e.goodsType}</td>
            <td>${e.vendorContact1}</td>
            <td>${e.vendorAddress}</td>
            <td>${e.vendorContact2}</td>
            <td>${e.vendorEmail}</td>
            <td>
                <button type="" class="btn btn-primary" onclick="editVendorDetails(${e.vendorId})">Edit</button>
                <button type="submit" class="btn btn-danger" onclick="deleteVendorDetails(${e.vendorId})">Delete</button>
            </td>
        </tr>`;
        document.querySelector(".vendors").appendChild(row);
    
    });
}

function deleteVendorDetails(vendorId){
    const response = confirm("Are you sure you want to delete this Vendor?");
    if(response){
        fetch('/deleteVendorDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vendorId: vendorId })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.status === 1){
                alert("Vendor Deleted Successfully");
                location.reload();
            }else{
                alert("Failed to Delete Vendor");
            }
        });
    }
}
async function getVendorDetails(vendorId) {
    const response = await fetch('/getVendorDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId: vendorId })
    });
    const data = await response.json();
    console.log(data);
    return data;
}
async function editVendorDetails(vendorId){
    const data = await getVendorDetails(vendorId);
    document.getElementById("vendorFirm").value = data[0].vendorFirm;
    document.getElementById("vendorName").value = data[0].vendorName;
    document.getElementById("firmGSTNum").value = data[0].firmGSTNum;
    document.getElementById("goodsType").value = data[0].goodsType;
    document.getElementById("vendorContact1").value = data[0].vendorContact1;
    document.getElementById("vendorAddress").value = data[0].vendorAddress;
    document.getElementById("vendorContact2").value = data[0].vendorContact2;
    document.getElementById("vendorEmail").value = data[0].vendorEmail;
    document.getElementById("vendorFirm").focus();
    document.getElementById("updateDetailsTitle").style.display = "block";
    document.getElementById("submitDetailsBtn").style.display = "none";
    document.getElementById("updateDetailsBtn").style.display = "block";
    document.getElementById("updateDetailsBtn").setAttribute("onclick", `updateVendorDetails(${data[0].vendorId})`);
    document.getElementById("cancelUpdateDetailsBtn").style.display = "block";
    window.scrollTo(100, 0);
}
function cancelUpdateDetails(){
    const response = confirm("Are you sure you want to cancel updating Vendor Details?");
    if(response){
        location.reload();
    }
    else{
        return;
    }
    
}
async function updateVendorDetails(vendorId){
    const vendorFirm = document.getElementById("vendorFirm").value;
    const vendorName = document.getElementById("vendorName").value;
    const firmGSTNum = document.getElementById("firmGSTNum").value;
    const goodsType = document.getElementById("goodsType").value;
    const vendorContact1 = document.getElementById("vendorContact1").value;
    const vendorAddress = document.getElementById("vendorAddress").value;
    const vendorContact2 = document.getElementById("vendorContact2").value;
    const vendorEmail = document.getElementById("vendorEmail").value;

    const response = await fetch('/updateVendorDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            vendorId: vendorId,
            vendorFirm: vendorFirm,
            vendorName: vendorName,
            firmGSTNum: firmGSTNum,
            goodsType: goodsType,
            vendorContact1: vendorContact1,
            vendorAddress: vendorAddress,
            vendorContact2: vendorContact2,
            vendorEmail: vendorEmail
        })
    });
    const data = await response.json();
    console.log(data);
    if(data.status === 1){
        alert("Vendor Details Updated Successfully");
        location.reload();
    }else{
        alert("Failed to Update Vendor Details");
    }
};


function searchVendorFirm() {
    const searchInput = document.getElementById("searchBar");
    const table = document.getElementById("vendorsTable");
    const rows = table.getElementsByTagName("tr");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        Array.from(rows).forEach((row, index) => {
            if (index < rows.length) { // Exclude the last row (sum row)
                const vendorFirm = row.cells[1].innerText.toLowerCase(); // Assuming Vendor Firm is in the fourth column
                row.style.display = vendorFirm.includes(searchTerm) ? "" : "none";
            }
        });
    });
}