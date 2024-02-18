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
const generateBillNumber = async() =>{
    const response = await fetch('/getLastBillNum');
    const data = await response.json();
    return data;
}
const showBillNumber = async () =>{
    const data = await generateBillNumber();
    let billNumber = data[0].billNum + 1;
    document.getElementById("billNum").value = billNumber;
};
showBillNumber();
showVendorsForSelect();