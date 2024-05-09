var mongoose = require("mongoose");

var workspaceSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Workspace", workspaceSchema);
