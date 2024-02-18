window.onload = () => {
  showPaymentModes();
};
document.getElementById("paymentModeName").focus();
async function addPaymentMode() {
  // console.log("clicked");
  const paymentModeName = document.getElementById("paymentModeName").value;
  const paymentModeStatus = document.getElementById("paymentModeStatus").value;
  const paymentModeDetails =
    document.getElementById("paymentModeDetails").value || "";
  const response = await fetch("/addPaymentModeData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentModeName: paymentModeName,
      paymentModeStatus: paymentModeStatus,
      paymentModeDetails: paymentModeDetails,
    }),
  });
  const data = await response.json();
  console.log(data);
  if (data.status === 1) {
    alert("Payment Mode Added Successfully");
    location.reload();
  } else {
    alert("Failed to Add Payment Mode");
  }
}
const fetchPaymentModes = async () => {
  const response = await fetch("/fetchPaymentModes");
  const data = await response.json();
  return data;
};

async function showPaymentModes() {
  const data = await fetchPaymentModes();
  let status = ``;

  data.forEach((e) => {
    const row = document.createElement("tr");
    if (e.paymentModeStatus === "Active") {
      status = `<p style="color: rgb(11, 196, 11);">Active</p>`;
    } else {
      status = `<p style="color:red;">Inactive</p>`;
    }
    row.innerHTML = `<tr>
        <td>${e.paymentModeId}</td>
        <td>${e.paymentModeName}</td>
        <td>${e.paymentModeDetails}</td>
        <td>${status}</td>
        <td>
                <button type="" class="btn btn-primary" onclick = editPaymentMode(${e.paymentModeId})>Edit</button>
                <button type="submit" class="btn btn-danger" onclick = deletePaymentMode(${e.paymentModeId})>Delete</button>
            </td>
        </tr>`;
    document.querySelector(".paymentModes").appendChild(row);
  });
}
async function deletePaymentMode(paymentModeId) {
  const choice = confirm("Are you sure you want to delete Payment Mode?");
  if (choice) {
    const response = await fetch("/deletePaymentMode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentModeId: paymentModeId,
      }),
    });
    const data = await response.json();
    if (data.status === 1) {
      alert("Payment Mode Deleted Successfully");
      location.reload();
    } else {
      alert("Failed to Delete Payment Mode");
    }
  } else {
    return;
  }
}
async function fetchPaymentMode(paymentModeId) {
  const response = await fetch("/getPaymentModeDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentModeId: paymentModeId,
    }),
  });
  const data = await response.json();
  return data;
}
async function editPaymentMode(paymentModeId) {
  const data = await fetchPaymentMode(paymentModeId);
    document.getElementById("updateDetailsTitle").style.display = "";
  document.getElementById("paymentModeName").value = data.paymentModeName;
  document.getElementById("paymentModeStatus").value = data.paymentModeStatus;
  document.getElementById("paymentModeDetails").value = data.paymentModeDetails;
  document.getElementById("addDetailsBtn").style.display = "none";
  document.getElementById("updateDetailsBtn").style.display = "";
  scrollToTop();
  document.getElementById("paymentModeName").focus();

  document
    .getElementById("updateDetailsBtn")
    .setAttribute("onclick", `updatePaymentMode(${paymentModeId})`);
}
async function updatePaymentMode(paymentModeId) {
  // const paymentModeId = document.getElementById("paymentModeId").value;
  const paymentModeName = document.getElementById("paymentModeName").value;
  const paymentModeStatus = document.getElementById("paymentModeStatus").value;
  const paymentModeDetails =
    document.getElementById("paymentModeDetails").value;
  const response = await fetch("/updatePaymentMode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentModeId: paymentModeId,
      paymentModeName: paymentModeName,
      paymentModeStatus: paymentModeStatus,
      paymentModeDetails: paymentModeDetails,
    }),
  });
  const data = await response.json();
  if (data.status === 1) {
    alert("Payment Mode Updated Successfully");
    location.reload();
  } else {
    alert("Failed to Update Payment Mode");
  }
}
function cancelUpdateDetails() {
  const response = confirm(
    "Are you sure you want to cancel Adding/Updating Payment Mode Details?"
  );
  if (response) {
    location.reload();
  } else {
    return;
  }
}

function scrollToTable() {
  window.scrollTo(0, document.body.scrollHeight);
}
function scrollToTop(){
    window.scrollTo(0, 0);
}
