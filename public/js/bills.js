// Fetching Vendors for Select

const fetchVendorsForSelect = async() =>{
    const response = await fetch('/fetchVendorsForSelect');
    const data = await response.json();
    showVendorsForSelect(data);
}

const showVendorsForSelect = (data) =>{
    data.forEach(e => {
        let option = document.createElement('option');
        option.innerHTML = `<option value="${e.vendorId}">${e.vendorFirm}</option>`;
        document.getElementById("vendorFirmName").appendChild(option);
    });
}
fetchVendorsForSelect();


