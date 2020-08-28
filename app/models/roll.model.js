const sql = require("./db.js");

// constructor
const Roll = function (boxId, dropoffPosition) {
  this.boxId = boxId
  this.dropoffPosition = dropoffPosition;
};

Roll.rollTheDice = (roll, result) => {
  console.log(roll.boxId);
  console.log(roll.dropoffPosition);
  sql.query(
    "INSERT INTO useraction (ClientId, Action, Parameters) SELECT c.Id, 'ROLL', ? FROM client c WHERE c.Id = ? AND c.AllowUserMode AND c.UserModeActive",
    [roll.dropoffPosition, roll.boxId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        console.log("could not insert useraction 'ROLL' @ " + roll.dropoffPosition + " for id " + roll.boxId);
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("inserted roll event");
      result(null, { boxId: roll.boxId, dropoffPosition: roll.dropoffPosition });
    }
  );
};

module.exports = Roll;