const Move = require("../models/move.model.js");

// Schedule a move in direction "direction" for box "boxId"
exports.scheduleMove = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Move.scheduleMove(
    new Move(req.params.boxId, req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "something went wrong..."
          });
        } else {
          res.status(500).send({
            message: "something went wrong..."
          });
        }
      } else res.send(data);
    }
  );
};