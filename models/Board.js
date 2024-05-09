var mongoose = require("mongoose");

var boardSchema = new mongoose.Schema({
  title: String,
  colour: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
});

module.exports = mongoose.model("Board", boardSchema);
