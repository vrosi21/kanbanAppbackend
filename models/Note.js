var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  colour: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  created: { type: Date, default: Date.now }, // Set created field default to current date
  reminder: { type: Date, required: false }, // Make reminder field optional
});

module.exports = mongoose.model("Note", noteSchema);
