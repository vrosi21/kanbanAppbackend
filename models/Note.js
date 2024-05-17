var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 256,
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
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  created: {
    type: Date,
    default: Date.now,
  },
  reminder: {
    type: Date,
    required: false,
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: "Reminder date must be after or equal to the current time.",
    },
  },
});

module.exports = mongoose.model("Note", noteSchema);
