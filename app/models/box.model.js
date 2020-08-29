const sql = require("./db.js");

// constructor
const Box = function(box) {
    this.id = box.id;
    this.allowUserMode = box.allowUserMode;
    this.userModeActive = box.userModeActive;
  };
  
Box.findById = (clientId, result) => {
    sql.query('SELECT Id, Material, Position, Latin, AllowUserMode, UserModeActive ' + 
              'FROM client WHERE id = ?',
              [clientId],
              (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("box: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      result({ kind: "not_found" }, null);
    });
};
  
Box.getAll = result => {
    sql.query('SELECT Id, Material, Position, Latin, AllowUserMode, UserModeActive, CurrentState ' + 
              'FROM client WHERE Position IS NOT NULL ORDER BY Position', (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("client: ", res);
      result(null, res);
    });
};
  
Box.enableUserMode = (id, result) => {
    sql.query(
      "UPDATE client SET UserModeActive = 1 WHERE id = ? AND AllowUserMode and NOT UserModeActive; " + 
      "INSERT INTO jobqueue (ClientId, JobCode, JobParameters) VALUES (?, ?, ?); ",
      [id, id, "U", ""],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res[0].affectedRows == 0) {
          console.log("could not switch to usermode for boxId: ", { id: id });
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("switched to usermode for boxId: ", { id: id });
        result(null, { id: id});
      }
    );
};
  
module.exports = Box;