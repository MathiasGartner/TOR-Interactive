const sql = require("./db.js");

// constructor
const Move = function (boxId, direction) {
  this.boxId = boxId
  this.direction = direction;
};

Move.scheduleMove = (move, result) => {
  defaultStepSize = 15;
  //console.log(move.boxId);
  //console.log(move.direction);
  sql.query(
    "INSERT INTO useraction (ClientId, Action, Parameters) SELECT c.Id, ?, ? FROM client c WHERE c.Id = ? and c.AllowUserMode and c.UserModeActive",
    [move.direction, defaultStepSize, move.boxId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        console.log("could not insert useraction " + move.direction + " for id " + move.boxId);
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("inserted step ");
      result(null, { boxId: move.boxId, direction: move.direction });
    }
  );
};

module.exports = Move;