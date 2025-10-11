const sql = require("./db.js");

var config = require('../../config');

// constructor
const Schedule = function() {
};
  
Schedule.getStatus = result => {
  sql.query('SELECT EXISTS(SELECT 1 FROM schedule s WHERE NOW() >= s.StartTime AND NOW() <= s.EndTime) AS ScheduleOn', (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("schedule on: ", res[0]);
    result(null, config.useSchedule ? res[0] : {"ScheduleOn": 1});
  });
};

module.exports = Schedule;