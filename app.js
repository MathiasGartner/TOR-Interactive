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
  if (req.path === '/' && !req.cookies.firstVisitLogged) {
    const ip = requestIp.getClientIp(req);
    const parser = new UAParser(req.headers['user-agent']);
    const ua = parser.getResult();

    const query = "INSERT INTO interactivevisits (Ip, Browser, OS, Device, UserAgent) VALUES (?, ?, ?, ?, ?)";
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
        return next(); // continue even if failed
      }

      const visitorId = result.insertId;
      console.log('New visitorId:', visitorId);

      res.cookie('firstVisitLogged', '1', { maxAge: MAX_COOKIE_AGE, httpOnly: true });
      res.cookie('visitorId', visitorId, { maxAge: MAX_COOKIE_AGE, httpOnly: true });

      next();
    });
  } 
  else {
    next();
  }
});


app.use((req, res, next) => {
  const visitorId = parseInt(req.cookies.visitorId, 10);
  const shouldLog = (
    req.path === '/' ||
    req.path === '/index' ||
    req.path.startsWith('/box') ||
    req.path.startsWith('/check') ||
    req.path.startsWith('/move') ||
    req.path.startsWith('/roll') ||
    req.path.startsWith('/schedule')
  );


  if (shouldLog && Number.isInteger(visitorId)) {
    const query = "INSERT INTO interactivelog (VisitorId, Path, Method, Referrer) VALUES (?, ?, ?, ?)";
    const values = [
      visitorId,
      req.originalUrl || req.path,
      req.method,
      req.get('Referer') || null
    ];

    sql.query(query, values, (err) => {
      if (err) {
        console.warn('Page logging failed:', err.message);
      }
    });
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
