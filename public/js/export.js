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

function showSelectVendor(){
    let reportType = document.getElementById("reportType").value;
    if(reportType != 1){
        document.querySelector(".selectVendor").style.display = "block";
        showVendorsForSelect();
        document.querySelector(".selectVendor").setAttribute("required", "required")
    }
    else{
        document.querySelector(".selectVendor").style.display = "none";
        document.querySelector(".selectVendor").removeAttribute("required")
    }
}
showSelectVendor();