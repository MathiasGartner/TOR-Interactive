const Move = require("../models/move.model.js");

// Schedule a move in direction "direction" for box "boxId"
exports.scheduleMove = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body);

  Move.scheduleMove(
    new Move(parseInt(req.params.boxId), req.body.direction),
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