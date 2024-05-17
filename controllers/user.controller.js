var User = require("../models/User.js");
var BaseController = require("./base.controller.js");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  async registerUser(req, res) {
    const userData = req.body;

    try {
      const user = new User(userData);

      const errors = user.validateSync();
      if (errors) return res.status(400).json(errors);

      const existingUser = await User.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const newUser = await user.save();

      const payload = { sub: newUser._id };
      const token = jwt.encode(payload, "123");

      res.status(200).json({ token: token });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).send("Error saving user");
    }
  }

  async loginUser(req, res) {
    const userData = req.body;

    try {
      const user = await User.findOne({ email: userData.email });

      if (!user) {
        return res.status(401).send({ message: "Email doesn't exist." });
      }

      bcrypt.compare(userData.password, user.password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).send({ message: "Password invalid." });
        }

        const payload = { sub: user._id };
        const token = jwt.encode(payload, "123");

        res.status(200).send({ token: token });
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).send("Error finding user");
    }
  }
}

module.exports = new UserController();
