// Fetching Vendors for Select

const fetchVendorsForSelect = async() =>{
    const response = await fetch('/fetchVendorsForSelect');
    const data = await response.json();
    return data;
}

const showVendorsForSelect = async () =>{
    const data = await fetchVendorsForSelect();
    data.forEach(e => {
        let option = document.createElement('option');
        option.innerHTML = `<option value="${e.vendorId}">${e.vendorFirm}</option>`;
        document.getElementById("vendorFirmName").appendChild(option);
    });
}

const fetchPaymentModesForSelect = async() =>{
    const response = await fetch('/fetchPaymentModesForSelect');
    const data = await response.json();
    return data;
}
const showPaymentModesForSelect = async() =>{
    const data = await fetchPaymentModesForSelect();
    console.log(data);
    data.forEach(e => {
        console.log(e);
        let option = document.createElement('option');
        option.innerHTML = `<option value="${e.paymentModeId}">${e.paymentModeName}</option>`;
        document.getElementById("paymentModeName").appendChild(option);
    });
}
showVendorsForSelect();
showPaymentModesForSelect();
