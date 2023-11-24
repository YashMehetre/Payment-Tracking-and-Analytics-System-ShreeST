const mysql = require('mysql')
const env = require('dotenv')
env.config();
var conn = mysql.createConnection({
    host: process.env.DB_HOST, // Replace with your host name
    user: process.env.DB_USER,      // Replace with your database username
    password: process.env.DB_PASSWORD,      // Replace with your database password
    database: process.env.DB_NAME // // Replace with your database Name
})
conn.connect(function(err){
    if(err){
        throw err;
    }
    else{
        console.log("Connected!");
      }
})

module.exports = conn;