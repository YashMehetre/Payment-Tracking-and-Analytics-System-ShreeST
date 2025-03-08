document.getElementById("logout-btn").addEventListener("click", logout);
async function logout() {
    let choice = confirm("Are you sure you want to logout?");
    if (!choice) {
        return;
    }
    try {
        const response = await fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
    }
}