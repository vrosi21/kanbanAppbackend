var mongoose = require("mongoose");

var boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16,
  },
  colour: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/i.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid colour. Please use a valid hexadecimal colour code (#xxx or #xxxxxx).`,
    },
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
});

module.exports = mongoose.model("Board", boardSchema);
