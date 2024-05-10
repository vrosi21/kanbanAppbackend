const Note = require("../models/Note.js");
const BaseController = require("./base.controller.js");

class NoteController extends BaseController {
  constructor() {
    super(Note);
  }
}

module.exports = new NoteController();
