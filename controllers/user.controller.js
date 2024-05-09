var User = require("../models/User.js");
var BaseController = require("./base.controller.js");

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

module.exports = new UserController();
