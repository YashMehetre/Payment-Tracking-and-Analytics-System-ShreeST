window.onload = () => {
    showPaymentModes();
  };

const fetchPaymentModes = async() =>{
    const response = await fetch('/fetchPaymentModes');
    const data = await response.json();
    return data;
}

async function showPaymentModes(){
    const data = await fetchPaymentModes();
    let status =`` ;
    
    data.forEach(e => {
        const row = document.createElement('tr');
        if (e.paymentModeStatus === "Active") {
            status = `<p style="color: rgb(11, 196, 11);">Active</p>`;
        }
        else{
            status = `<p style="color:red;">Inactive</p>`;
        }
        row.innerHTML = `<tr>
        <td>${e.paymentModeId}</td>
        <td>${e.paymentModeName}</td>
        <td>${e.paymentModeDetails}</td>
        <td>${status}</td>
        <td>
                <button type="" class="btn btn-primary">Edit</button>
                <button type="submit" class="btn btn-danger">Delete</button>
            </td>
        </tr>`
        document.querySelector(".paymentModes").appendChild(row);
    });
}
function scrollToTable(){
    window.scrollTo(0, document.body.scrollHeight);
    console.log('Hello');
}