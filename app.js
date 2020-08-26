var config = require('./config');
var configPrivate = require('./configPrivate');
let express = require('express');
let app = express();
var http = require('http');
var mysql = require('mysql');

var dbConn = mysql.createConnection({
    host: configPrivate.DB_HOST,
    user: configPrivate.DB_USER,
    password: configPrivate.DB_PASSWORD,
    database: configPrivate.DB_NAME
});
  
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB server!");
});

http.createServer(function (req, res) {
	console.log(req.httpVersion + '\n');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(config.port, "0.0.0.0");

console.log('Server running at http://0.0.0.0:' + config.port + '/');
