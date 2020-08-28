const Roll = require("../models/roll.model.js");

exports.getLastResult = (req, res) => {
  Roll.getLastResult(req.params.boxId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Could not get last result for Box with id " + req.params.boxId
          });
        } else {
          res.status(500).send({
            message: "Error retrieving last result for Box with id " + req.params.boxId
          });
        }
      } else res.send(data);
  });
};

// Schedule a roll move at dropoffPosition for box "boxId"
exports.rollTheDice = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body);

  Roll.rollTheDice(
    new Roll(parseInt(req.params.boxId), req.body.dropoffPosition),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "something went wrong (404)..."
          });
        } else {
          res.status(500).send({
            message: "something went wrong (500)..."
          });
        }
      } else res.send(data);
    }
  );
};