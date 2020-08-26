module.exports = app => {
    const boxes = require("../controllers/box.controller.js");
      
    // Retrieve all Boxes
    app.get("/boxes", boxes.findAll);
  
    // Retrieve a single Box with boxId
    app.get("/boxes/:boxId", boxes.findOne);
  
    // Update a Box with boxId
    app.put("/boxes/:boxId", boxes.update);
};