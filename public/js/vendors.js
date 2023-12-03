window.onload = () => {
    fetchVendors();
  };
  

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
                <button type="" class="btn btn-primary">Edit</button>
                <button type="submit" class="btn btn-danger">Delete</button>
            </td>
        </tr>`;
        document.querySelector(".vendors").appendChild(row);
    
    });
   
    
}

