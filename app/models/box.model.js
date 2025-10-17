const sql = require("./db.js");

// constructor
const Box = function(box) {
  this.id = box.id;
  this.allowUserMode = box.allowUserMode;
  this.userModeActive = box.userModeActive;
};
  
Box.getAll = result => {
  sql.query('SELECT Id, Material, Position, Latin, CASE WHEN (AllowUserMode + IsActive) = 2 THEN 1 ELSE 0 END as AllowUserMode, UserModeActive, CurrentState ' + 
            'FROM client WHERE Position IS NOT NULL ORDER BY Position', (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("client: ", res);
    result(null, res);
  });
};
  
Box.findById = (clientId, result) => {
  sql.query('SELECT Id, Material, Position, Latin, CASE WHEN (AllowUserMode + IsActive) = 2 THEN 1 ELSE 0 END as AllowUserMode, UserModeActive, CurrentState ' + 
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
  
Box.enableUserMode = (id, result) => {
  sql.query(
    "SELECT AllowUserMode FROM client WHERE id = ?", [id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length === 0 || !res[0].AllowUserMode) {
        console.log("usermode not allowed for boxId: ", { id: id });
        result({ kind: "not_available" }, null);
        return;
      }

      sql.beginTransaction(err => {
        if (err) return result(null, err);
  
        sql.query(
          "UPDATE client SET UserModeActive = 1 WHERE id = ? AND AllowUserMode AND NOT UserModeActive",
          [id],
          (err, updateRes) => {
            if (err) return sql.rollback(() => result(null, err));
  
            if (updateRes.affectedRows === 0)
              return sql.rollback(() => result({ kind: "not_found" }, null));
  
            sql.query(
              "INSERT INTO jobqueue (ClientId, JobCode, JobParameters) VALUES (?, ?, ?)",
              [id, "U", ""],
              (err, insertRes) => {
                if (err) return sql.rollback(() => result(null, err));
  
                sql.commit(err => {
                  if (err) return sql.rollback(() => result(null, err));
  
                  console.log("switched to usermode for boxId:", { id });
                  result(null, { id });
                });
              }
            );
          }
        );
      });
    }
  );
};
  
module.exports = Box;
