module.exports = app => {
    const schedule = require("../controllers/schedule.controller.js");
      
    // Check if schedule is on or off
    app.get("/schedule", schedule.status);
};