const Schedule = require("../models/schedule.model.js");

// Check if schedule is on or off
exports.status = (req, res) => {
  Schedule.getStatus((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the current schedule."
      });
    else res.send(data);
  });
};
