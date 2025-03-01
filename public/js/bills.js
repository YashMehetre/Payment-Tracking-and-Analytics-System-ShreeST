// Fetching Vendors for Select
document.getElementById("addBillData").addEventListener("click", addBillData);
document
  .getElementById("searchBillData")
  .addEventListener("click", searchBillData);
window.onload = () => {
  document.getElementById("vendorFirmName").focus();
};
document
  .getElementById("billWeightPerBox")
  .addEventListener("input", function () {
    let totalBoxes = document.getElementById("billTotalBoxes").value;
    let weightPerBox = document.getElementById("billWeightPerBox").value;
    let totalWeight = totalBoxes * weightPerBox;
    document.getElementById("billTotalWeight").value = totalWeight;
  });
document
  .getElementById("billTotalBoxes")
  .addEventListener("input", function () {
    let totalBoxes = document.getElementById("billTotalBoxes").value;
    let weightPerBox = document.getElementById("billWeightPerBox").value;
    let totalWeight = totalBoxes * weightPerBox;
    document.getElementById("billTotalWeight").value = totalWeight;
  });

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

const generateBillNumber = async () => {
  const response = await fetch("/getLastBillNum");
  const data = await response.json();
  return data;
};

const showBillNumber = async () => {
  const data = await generateBillNumber();
  let billNumber = data[0].billNum + 1;
  document.getElementById("billNum").value = billNumber;
};

async function addBillData() {
  let billDate = document.getElementById("billDate").value;
  let vendorFirmName = document.getElementById("vendorFirmName").value;
  let billGoodsType = document.getElementById("billGoodsType").value;
  let billTotalBoxes = document.getElementById("billTotalBoxes").value;
  let billWeightPerBox = document.getElementById("billWeightPerBox").value;
  let billTotalWeight = document.getElementById("billTotalWeight").value;
  let billMarketAmount = document.getElementById("billMarketAmount").value;
  let billPaymentAmount = document.getElementById("billPaymentAmount").value;
  let billMoreDetails = document.getElementById("billMoreDetails").value || "";
  if (
    billDate == "" ||
    vendorFirmName == "" ||
    billGoodsType == "" ||
    billTotalBoxes == "" ||
    billWeightPerBox == "" ||
    billTotalWeight == "" ||
    billMarketAmount == ""
  ) {
    alert("Please fill all the required fields");
    return;
  } else {
    if (billPaymentAmount == "") {
      alert("Party Payment Amount is not filled.");
      billPaymentAmount = null;
    }
    let data = {
      billDate,
      vendorFirmName,
      billGoodsType,
      billTotalBoxes,
      billWeightPerBox,
      billTotalWeight,
      billMarketAmount,
      billPaymentAmount,
      billMoreDetails,
    };
    const response = await fetch("/addBillData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.status === 1) {
      alert("Bill Data Added Successfully");
      location.reload();
    } else {
      alert("Error Occurred");
    }
  }
}

async function fetchLastBillData(limit) {
  const response = await fetch(`/fetchLastBillData?limit=${limit}`);
  const data = await response.json();
  return data;
}
async function showLastBillData() {
  try {
    const data = await fetchLastBillData(5);
    let tableBody = document.querySelector(".billDetails");
    data.forEach((e) => {
      let billMarketAmount = parseFloat(e.billMarketAmount) || 0;
      let profitLoss;
      let billPaymentAmount;
      if (e.billPaymentAmount == null) {
        billPaymentAmount = "-";
        profitLoss = "-";
        billMarketAmount = billMarketAmount.toLocaleString("en-IN", {
          useGrouping: true,
        });
      } else {
        billPaymentAmount = parseFloat(e.billPaymentAmount) || 0;
        profitLoss = billPaymentAmount - billMarketAmount;
        billPaymentAmount = billPaymentAmount.toLocaleString("en-IN", {
          useGrouping: true,
        });
        billMarketAmount = billMarketAmount.toLocaleString("en-IN", {
          useGrouping: true,
        });
      }
      let tr = document.createElement("tr");
      tr.innerHTML = `<td>${e.billNum}</td>
            <td style="font-weight:bold;">${e.vendorFirm}</td>
            <td>${e.billDate}</td>
            <td>${e.billGoodsType}</td>
            <td>${e.billTotalBoxes}</td>
            <td>${e.billWeightPerBox}</td>
            <td>${e.billTotalWeight}</td>
            <td style="font-weight:bold;">${billMarketAmount}</td>
            <td style="font-weight:bold;">${billPaymentAmount}</td>
            <td>${e.billMoreDetails}</td>
            <td>
            ${
              e.billPaymentAmount == null
                ? `<button type="button" class="btn btn-warning" onclick="notifyUser(${e.billNum},'${e.vendorFirm}')">Notify</button>`
                : ""
            }
            <button type="button" class="btn btn-primary" onclick="editBillDetails(${
              e.billNum
            })">Edit</button>
            <button type="button" class="btn btn-danger" onclick="deleteBillDetails(${
              e.billNum
            })">Delete</button>
            </td>`;
      tableBody.appendChild(tr);

      // Adjust profitLoss color
      const profitLossCell = tr.querySelector(".profit-loss");
      if (profitLossCell) {
        profitLossCell.textContent =
          profitLoss === "-"
            ? "-"
            : profitLoss.toLocaleString("en-IN", { useGrouping: true });
        profitLossCell.style.color = profitLoss > 0 ? "green" : "red";
      }
    });
  } catch (error) {
    console.error("Error loading last bill data:", error);
  }
}

async function searchBillData() {
  try {
    let vendorFirmName = document.getElementById("vendorFirmNameSearch").value;
    let date = document.getElementById("billSearchDate").value;
    if (vendorFirmName == "" || date == "") {
      alert("Please Choose the Date and the Vendor Firm Name!");
      return;
    } else {
      const response = await fetch(
        `/searchBillData?vendorFirmName=${vendorFirmName}&date=${date}`
      );
      const data = await response.json();
      let tableBody = document.querySelector(".billDetails");
      tableBody.innerHTML = "";
      data.forEach((e) => {
        let billMarketAmount = parseFloat(e.billMarketAmount) || 0;
        let profitLoss;
        let billPaymentAmount =
          e.billPaymentAmount !== null
            ? parseFloat(e.billPaymentAmount).toLocaleString("en-IN", {
                useGrouping: true,
              })
            : "-";
        if (e.billPaymentAmount !== null) {
          profitLoss = parseFloat(e.billPaymentAmount) - billMarketAmount;
        } else {
          profitLoss = "-";
          billMarketAmount = billMarketAmount.toLocaleString("en-IN", {
            useGrouping: true,
          });
        }
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${e.billNum}</td>
                <td style="font-weight:bold;">${e.vendorFirm}</td>
                <td>${e.billDate}</td>
                <td>${e.billGoodsType}</td>
                <td>${e.billTotalBoxes}</td>
                <td>${e.billWeightPerBox}</td>
                <td>${e.billTotalWeight}</td>
                <td style="font-weight:bold;">${billMarketAmount}</td>
                <td style="font-weight:bold;">${billPaymentAmount}</td>
                <td>${e.billMoreDetails}</td>
                <td>
                ${
                  e.billPaymentAmount == null
                    ? `<button class="btn btn-warning" onclick="notifyUser(${e.billNum},'${e.vendorFirm}')">Notify</button>`
                    : ""
                }
                <button type="button" class="btn btn-primary" onclick="editBillDetails(${
                  e.billNum
                })">Edit</button>
                <button type="button" class="btn btn-danger" onclick="deleteBillDetails(${
                  e.billNum
                })">Delete</button>
                </td>`;
        tableBody.appendChild(tr);

        // Adjust profitLoss color
        const profitLossCell = tr.querySelector(".profit-loss");
        if (profitLossCell) {
          profitLossCell.textContent =
            profitLoss === "-"
              ? "-"
              : profitLoss.toLocaleString("en-IN", { useGrouping: true });
          profitLossCell.style.color = profitLoss > 0 ? "green" : "red";
        }
      });
    }
  } catch (error) {
    console.error("Error searching bill data:", error);
  }
}

async function deleteBillDetails(billNum) {
  const choice = confirm("Do you want to delete the bill?");
  if (choice == true) {
    const response = await fetch(`/deleteBillDetails?billNum=${billNum}`);
    const data = await response.json();
    if (data.status === 1) {
      alert("Bill Deleted Successfully");
      location.reload();
    } else {
      alert("Could not delete the Bill Details");
    }
  } else {
    return;
  }
}
async function fetchBillData(billNum) {
  const response = await fetch(`/fetchBillData?billNum=${billNum}`);
  const data = await response.json();
  return data;
}
async function editBillDetails(billNum) {
  const data = await fetchBillData(billNum);
  const date = data[0].billDate.split("-").reverse().join("-");
  document.getElementById("billNum").value = data[0].billNum;
  document.getElementById("billDate").value = date;
  document.getElementById("vendorFirmName").value = data[0].vendorFirm;
  document.getElementById("billGoodsType").value = data[0].billGoodsType;
  document.getElementById("billTotalBoxes").value = data[0].billTotalBoxes;
  document.getElementById("billWeightPerBox").value = data[0].billWeightPerBox;
  document.getElementById("billTotalWeight").value = data[0].billTotalWeight;
  document.getElementById("billMarketAmount").value = data[0].billMarketAmount;
  document.getElementById("billPaymentAmount").value =
    data[0].billPaymentAmount || "";
  document.getElementById("billMoreDetails").value = data[0].billMoreDetails;
  document.getElementById("addBillData").style.display = "none";
  document.getElementById("updateBillData").style.display = "";
  scrollTo(0, 100);
  document.getElementById("updateDetailsTitle").style.display = "";
  document.getElementById("vendorFirmName").disabled = true;
}
document
  .getElementById("updateBillData")
  .addEventListener("click", updateBillData);

async function updateBillData() {
  let billNum = document.getElementById("billNum").value;
  let billDate = document.getElementById("billDate").value;
  let billGoodsType = document.getElementById("billGoodsType").value;
  let billTotalBoxes = document.getElementById("billTotalBoxes").value;
  let billWeightPerBox = document.getElementById("billWeightPerBox").value;
  let billTotalWeight = document.getElementById("billTotalWeight").value;
  let billMarketAmount = document.getElementById("billMarketAmount").value;
  let billPaymentAmount = document.getElementById("billPaymentAmount").value;
  let billMoreDetails = document.getElementById("billMoreDetails").value || "";
  if (
    billNum == "" ||
    billDate == "" ||
    vendorFirmName == "" ||
    billGoodsType == "" ||
    billTotalBoxes == "" ||
    billWeightPerBox == "" ||
    billTotalWeight == "" ||
    billMarketAmount == ""
  ) {
    alert("Please fill all the required fields!");
    return;
  }
  if (billPaymentAmount == "") {
    // let choice = confirm(
    //   "Do you want to notify the Vendor about the Payment Amount?"
    // );
    // if (choice == true) {
    //   notifyUserWhileEdit(billNum);
    // }
    alert("Party Payment Amount is not filled.");
    billPaymentAmount = null;
  }
  const choice = confirm("Do you want to update the bill details?");
  if (choice == true) {
    let data = {
      billNum,
      billDate,
      billGoodsType,
      billTotalBoxes,
      billWeightPerBox,
      billTotalWeight,
      billMarketAmount,
      billPaymentAmount,
      billMoreDetails,
    };
    const response = await fetch("/updateBillData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.status === 1) {
      alert("Bill Data Updated Successfully");
      location.reload();
    } else {
      alert("Error Occurred");
    }
  }
  return;
}
async function fetchLastBillDate() {
  const response = await fetch("/fetchLastBillDate");
  const data = await response.json();
  return data;
}
async function showLastBillDate() {
  const data = await fetchLastBillDate();
  const date = data[0].billDate.split("-").reverse().join("-");
  document.getElementById("billDate").value = date;
}
async function notifyUser(billNumber, vendorFirm) {
  const choice = confirm(
    `Do you want to notify ${vendorFirm} about bill number ${billNumber}?`
  );

  if (choice) {
    try {
      const response = await fetch("/sendPendingPartyAmountMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billNum: billNumber }),
      });

      if (response.ok) {
        alert(`✅ Successfully notified.`);
      } else {
        alert(
          `❌ Failed to notify ${vendorFirm}.\nPlease verify the contact number and try again.`
        );
      }
    } catch (error) {
      console.error("Error notifying vendor:", error);
      alert(
        `⚠️ An error occurred while notifying ${vendorFirm}. Please try again later.`
      );
    }
  }
}

document.getElementById("cancelAction").addEventListener("click", cancelAction);
function cancelAction() {
  location.reload();
}
function scrollToTable() {
  scrollTo(0, document.body.scrollHeight / 2 - 50);
}
showLastBillDate();
showLastBillData();
showBillNumber();
showVendorsForSelect();
