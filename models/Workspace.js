var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
  description: String,
  colour: String,
  created: { type: String, required: false }, // Make created field optional
  reminder: { type: String, required: false }, // Make reminder field optional
});

var boardSchema = new mongoose.Schema({
  title: String,
  colour: String,
  arrayOfNotes: [noteSchema],
});

var workspaceSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  arrayOfBoards: [boardSchema],
});

module.exports = mongoose.model("Workspace", workspaceSchema);
