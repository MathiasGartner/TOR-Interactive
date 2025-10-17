const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const UAParser = require("ua-parser-js");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sql = require('./app/models/db.js');

const app = express();

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MAX_COOKIE_AGE = 60 * 60 * 1000; // 1 hour

app.use((req, res, next) => {
    // Only log for root page
    if (req.path === '/' && !req.cookies.firstVisitLogged) {
        const ip = requestIp.getClientIp(req);
        const parser = new UAParser(req.headers['user-agent']);
        const ua = parser.getResult();

        const query = "INSERT INTO interactivelog (Ip, Browser, OS, Device, UserAgent) VALUES (?, ?, ?, ?, ?)";
        
        const values = [
            ip,
            ua.browser.name || '',
            ua.os.name || '',
            ua.device.type || 'desktop',
            req.headers['user-agent'] || ''
        ];

        sql.query(query, values, (err, result) => {
            if (err) {
                console.error('Failed to log client to database:', err);
                console.log('client info:', values);
            }
        });

        // Set a cookie so we don’t log this client again
        res.cookie('firstVisitLogged', '1', { maxAge: MAX_COOKIE_AGE });
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

require("./app/routes/box.routes.js")(app);
require("./app/routes/check.routes.js")(app);
require("./app/routes/move.routes.js")(app);
require("./app/routes/roll.routes.js")(app);
require("./app/routes/schedule.routes.js")(app);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// Start server
app.listen(config.port, "0.0.0.0", () => {
    console.log(`Server is running on port ${config.port}`);
});
