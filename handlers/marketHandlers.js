const pool = require("../modules/database");

// ✅ Add a New Market
const handleAddMarket = async (req, res) => {
    const { marketName, marketLocation, marketGST, marketStatus } = req.body;
    const sql = `INSERT INTO markets (marketName, marketLocation, marketGST, marketStatus) VALUES (?, ?, ?, ?)`;

    try {
        await pool.promise().execute(sql, [marketName, marketLocation, marketGST, marketStatus]);
        res.json({ status: 1, message: "Market added successfully" });
    } catch (error) {
        res.status(500).json({ status: 0, error: "Database error", details: error.message });
    }
};

// ✅ Fetch All Markets
const handleFetchMarkets = async (req, res) => {
    try {
        const [markets] = await pool.promise().query("SELECT * FROM markets");
        res.json(markets);
    } catch (error) {
        res.status(500).json({ status: 0, error: "Database error", details: error.message });
    }
};

// ✅ Fetch Single Market Details
const handleGetMarketDetails = async (req, res) => {
    try {
        const { marketId } = req.params;
        const [market] = await pool.promise().query("SELECT * FROM markets WHERE marketId = ?", [marketId]);

        if (market.length === 0) {
            return res.status(404).json({ error: "Market not found" });
        }

        res.json(market[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

// ✅ Update Market Details
const handleUpdateMarket = async (req, res) => {
    try {
        const { marketId, marketName, marketLocation, marketGST, marketStatus } = req.body;
        await pool.promise().query(
            "UPDATE markets SET marketName = ?, marketLocation = ?, marketGST = ?, marketStatus = ? WHERE marketId = ?",
            [marketName, marketLocation, marketGST, marketStatus, marketId]
        );

        res.json({ status: 1, message: "Market updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

module.exports = {
    handleAddMarket,
    handleFetchMarkets,
    handleGetMarketDetails,
    handleUpdateMarket
};
