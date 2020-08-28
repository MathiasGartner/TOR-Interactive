module.exports = app => {
    const roll = require("../controllers/roll.controller.js");      
  
    // Send die roll command for boxId
    app.put("/roll/:boxId", roll.rollTheDice);
};