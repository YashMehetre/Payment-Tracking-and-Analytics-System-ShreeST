window.onload = function () {
  document.getElementById("paymentDate").focus();
};
const fetchLastPaymentDate = async () => {
  const response = await fetch("/fetchLastPaymentDate");
  const result = await response.json();
  return result;
};

const showLastPaymentDate = async () => {
  const data = await fetchLastPaymentDate();
  document.getElementById("paymentDate").value = data[0].paymentDate;
};

const addPaymentData = async () => {
  let data = {
    vendorFirmName: document.getElementById("vendorFirmName").value,
    paymentDate: document.getElementById("paymentDate").value,
    paymentModeName: document.getElementById("paymentModeName").value,
    paymentReceivedAmt: document.getElementById("paymentReceivedAmt").value,
    paymentMoreDetails:
      document.getElementById("paymentMoreDetails").value || "",
  };
  // console.log(data);
  if (
    data.vendorFirmName === "" ||
    data.paymentDate === "" ||
    data.paymentModeName === "" ||
    data.paymentReceivedAmt === ""
  ) {
    alert("Please Enter All The Required Fields!");
    return;
  } else {
    const response = await fetch("/addPaymentData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if (result.status === 1) {
      alert("Payment Data Added Successfully");
      location.reload();
    } else {
      alert("Error Occurred");
    }
  }
};
document
  .getElementById("addPaymentData")
  .addEventListener("click", addPaymentData);

const fetchVendorsForSelect = async () => {
  const response = await fetch("/fetchVendorsForSelect");
  const data = await response.json();
  return data;
};

const showVendorsForSelect = async () => {
  const data = await fetchVendorsForSelect();
  data.forEach((e) => {
    let option = document.createElement("option");
    option.innerHTML = `<option value="${e.vendorId}">${e.vendorFirm}</option>`;
    document.getElementById("vendorFirmName").appendChild(option);
  });
  data.forEach((e) => {
    let option = document.createElement("option");
    option.innerHTML = `<option value="${e.vendorId}">${e.vendorFirm}</option>`;
    document.getElementById("vendorFirmNameSearch").appendChild(option);
  });
};

const fetchPaymentModesForSelect = async () => {
  const response = await fetch("/fetchPaymentModesForSelect");
  const data = await response.json();
  return data;
};
const showPaymentModesForSelect = async () => {
  const data = await fetchPaymentModesForSelect();
  data.forEach((e) => {
    let option = document.createElement("option");
    option.innerHTML = `<option value=${e.paymentModeId}>${e.paymentModeName}</option>`;
    document.getElementById("paymentModeName").appendChild(option);
  });
};

const fetchLastTenPaymentDetails = async () => {
  const response = await fetch("/fetchLastTenPaymentDetails");
  const data = await response.json();
  return data;
};
const showLastTenPaymentDetails = async () => {
  const data = await fetchLastTenPaymentDetails();
  data.forEach((e) => {
    let amount = e.paymentReceivedAmt.toLocaleString("en-IN", {
      useGrouping: true,
    });
    const row = document.createElement("tr");
    row.innerHTML = `<tr>
        <td>${e.paymentId}</td>
        <td style="font-weight:bold;">${e.vendorId}</td>
        <td>${e.paymentDate}</td>
        <td>${e.paymentModeId}</td>
        <td style="color: #1ac949; font-weight:bold;">${amount}</td>
        <td>${e.paymentMoreDetails}</td>
        <td>
        <!--<button type="" class="btn btn-primary" onclick="editPaymentDetails(${e.paymentId})">Edit</button>-->
        <button type="submit" class="btn btn-danger" onclick="deletePaymentDetails(${e.paymentId})">Delete</button>
    </tr>`;
    document.querySelector(".paymentDetails").appendChild(row);
  });
  await handleConvertVendorId();
  await handleConvertPaymentModeId();
};

async function searchPaymentData() {
  let fromDate = document.getElementById("paymentSearchFromDate").value;
  // let toDate = document.getElementById("paymentSearchToDate").value;
  let vendorFirmNameSearch = document.getElementById(
    "vendorFirmNameSearch"
  ).value;
  if (fromDate === "" || vendorFirmNameSearch === "") {
    alert("Please Enter Date and Choose Vendor Firm");
  } else {
    let data = {
      fromDate: fromDate,
      // toDate: toDate,
      vendorFirmNameSearch: vendorFirmNameSearch,
    };
    const response = await fetch("/searchPaymentData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if (result.length > 0) {
      document.querySelector(".paymentDetails").innerHTML = "";
      result.forEach((e) => {
        let amount = e.paymentReceivedAmt.toLocaleString("en-IN", {
          useGrouping: true,
        });
        const row = document.createElement("tr");
        row.innerHTML = `<tr>
                <td>${e.paymentId}</td>
                <td style="font-weight:bold;">${e.vendorId}</td>
                <td>${e.paymentDate}</td>
                <td>${e.paymentModeId}</td>
                <td style="color: #1ac949; font-weight:bold;">${amount}</td>
                <td>${e.paymentMoreDetails}</td>
                <td>
                <!--<button type="" class="btn btn-primary" onclick="editPaymentDetails(${e.paymentId})">Edit</button>-->
                <button type="submit" class="btn btn-danger" onclick="deletePaymentDetails(${e.paymentId})">Delete</button>
            </tr>`;
        document.querySelector(".paymentDetails").appendChild(row);
      });
      await handleConvertVendorId();
      await handleConvertPaymentModeId();
    } else {
      alert("No Data Found");
    }
  }
}

const fetchPaymentDetails = async (paymentId) => {
  const response = await fetch("/fetchPaymentDetails?paymentId=" + paymentId);
  const data = await response.json();
  return data;
};
// const editPaymentDetails = async (paymentId) => {

//     const data = await fetchPaymentDetails(paymentId);
//     data.forEach((e) => {
//       if (e.paymentId === paymentId) {

//         document.getElementById("vendorFirmName").value = e.vendorId;
//         document.getElementById("paymentDate").value = e.paymentDate;
//         // document.getElementById("paymentModeName").option.value = e.paymentModeId;
//         document.getElementById("paymentReceivedAmt").value = e.paymentReceivedAmt;
//         document.getElementById("paymentMoreDetails").value = e.paymentMoreDetails;
//       }
//     });
//   }

function deletePaymentDetails(paymentId) {
  if (confirm("Are you sure you want to delete?")) {
    fetch("/deletePaymentDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1) {
          alert("Payment Data Deleted Successfully");
          location.reload();
        } else {
          alert("Error Occurred");
        }
      });
  }
}

function scrollToTable() {
  window.scrollTo(0, document.body.scrollHeight / 2 - 200);
}
async function vendorIdConversion() {
  const response = await fetch("/vendorIdConversion");
  const data = await response.json();
  return data;
}

async function handleConvertVendorId() {
  const data = await vendorIdConversion();
  const tableBody = document.querySelector(".paymentDetails");
  const rows = tableBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < data.length; j++) {
      if (cells[1].innerText == data[j].vendorId) {
        cells[1].innerText = data[j].vendorFirm;
      }
    }
  }
}
async function paymentModeIdConversion() {
  const response = await fetch("/paymentModeIdConversion");
  const data = await response.json();
  // console.log(data);
  return data;
}

async function handleConvertPaymentModeId() {
  const data = await paymentModeIdConversion();
  const tableBody = document.querySelector(".paymentDetails");
  const rows = tableBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < data.length; j++) {
      if (cells[3].innerText == data[j].paymentModeId) {
        cells[3].innerText = data[j].paymentModeName;
      }
    }
  }
}

function cancel() {
  location.reload();
}
showLastPaymentDate();
showLastTenPaymentDetails();
showVendorsForSelect();
showPaymentModesForSelect();
