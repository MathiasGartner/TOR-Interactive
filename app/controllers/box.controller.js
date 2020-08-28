const Box = require("../models/box.model.js");


// Retrieve all Boxes from the database.
exports.findAll = (req, res) => {
    Box.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving boxes."
        });
      else res.send(data);
    });
  };

// Find a single Box with a boxId
exports.findOne = (req, res) => {
    Box.findById(req.params.boxId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Could not find Box with id ${req.params.boxId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Box with id " + req.params.boxId
            });
          }
        } else res.send(data);
    });
};

// Update a Box identified by the boxId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Box.enableUserMode(
    req.params.boxId,
    new Box(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Could not find Box with id ${req.params.boxId}."
          });
        } else {
          res.status(500).send({
            message: "Error updating Box with id " + req.params.boxId
          });
        }
      } else res.send(data);
    }
  );
};