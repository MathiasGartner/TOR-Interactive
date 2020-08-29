const mysql = require("mysql");
const configPrivate = require("../../configPrivate.js");

var dbConn = mysql.createConnection({
    host: configPrivate.DB_HOST,
    user: configPrivate.DB_USER,
    password: configPrivate.DB_PASSWORD,
    database: configPrivate.DB_NAME,
    multipleStatements: true
});
  
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB server!");
});

module.exports = dbConn;