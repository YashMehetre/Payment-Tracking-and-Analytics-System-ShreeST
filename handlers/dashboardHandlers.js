async function handleLogout(req, res) {
    try {
        res.clearCookie("authToken").status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

module.exports = { handleLogout };