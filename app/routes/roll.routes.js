module.exports = app => {
    const roll = require("../controllers/roll.controller.js");      
  
    // Retrieve the last result for boxId
    app.get("/roll/:boxId", roll.getLastResult);
  
    // Send die roll command for boxId
    app.put("/roll/:boxId", roll.rollTheDice);
};