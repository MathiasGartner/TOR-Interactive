module.exports = app => {
    const move = require("../controllers/move.controller.js");      
  
    // Move box with id boxId in direction
    app.put("/move/:boxId", move.scheduleMove);
};