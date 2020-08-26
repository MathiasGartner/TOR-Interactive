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
    sql.query('SELECT Id, Material, Position, Latin, AllowUserMode, UserModeActive ' + 
              'FROM client', (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("client: ", res);
      result(null, res);
    });
};
  
Box.updateById = (id, box, result) => {
    sql.query(
      "UPDATE client SET UserModeActive = ? WHERE id = ?",
      [box.userModeActive, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated box: ", { id: id, ...box });
        result(null, { id: id, ...box });
      }
    );
};
  
module.exports = Box;