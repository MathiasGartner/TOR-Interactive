var config = require('./config');
let express = require('express');
let bodyParser = require("body-parser");
let app = express();
//var http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

require("./app/routes/box.routes.js")(app);

/*
http.createServer(function (req, res) {
	console.log(req.httpVersion + '\n');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(config.port, "0.0.0.0");*/

app.get('/', function(req, res) {
    res.sendFile("index.html", { root: __dirname });
});

// set port, listen for requests
app.listen(80, () => {
    console.log("Server is running on port 3000.");
});

console.log('Server running at http://0.0.0.0:' + config.port + '/');
