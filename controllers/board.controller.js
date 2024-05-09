const Board = require("../models/Board.js");
const BaseController = require("./base.controller.js");

class BoardController extends BaseController {
  constructor() {
    super(Board);
  }
}

module.exports = new BoardController();
