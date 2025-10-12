var config = require('./config');
let express = require('express');
let path = require('path');
let bodyParser = require("body-parser");
var cors = require('cors')
let app = express();
//var http = require('http');

app.use(cors()) 

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

require("./app/routes/box.routes.js")(app);
require("./app/routes/check.routes.js")(app);
require("./app/routes/move.routes.js")(app);
require("./app/routes/roll.routes.js")(app);
require("./app/routes/schedule.routes.js")(app);

/*
http.createServer(function (req, res) {
	console.log(req.httpVersion + '\n');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(config.port, "0.0.0.0");*/

app.get('/', function(req, res) {
    //res.sendFile("index.html", { root: __dirname });
    res.redirect('index.html');
});

// set port, listen for requests
app.listen(config.port, () => {
    console.log("Server is running on port " + config.port + ".");
});

console.log('Server running at http://0.0.0.0:' + config.port + '/');
