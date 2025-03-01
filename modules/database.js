const mysql = require("mysql2");
const env = require("dotenv");
env.config();

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit based on your needs
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
  } else {
    console.log("Connected to database!");
    connection.release();
  }
});

module.exports = pool;
