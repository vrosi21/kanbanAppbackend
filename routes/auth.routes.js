const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const User = require("../models/User.js");
const express = require("express");
const UserController = require("../controllers/user.controller.js");

// Middleware function to check if the request is authenticated
function checkAuthenticated(req, res, next) {
  if (!req.header("authorization")) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing auth header." });
  }
  const token = req.header("authorization").split(" ")[1];

  try {
    const payload = jwt.decode(token, "123");
    if (!payload) {
      return res
        .status(401)
        .send({ message: "Unauthorized: Auth header invalid." });
    }

    req.userId = payload.sub;
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(401).send({ message: "Unauthorized: Invalid token" });
  }
}

// Route handler for registering a new user
async function registerUser(req, res) {
  const userData = req.body;

  try {
    const user = new User(userData);
    const newUser = await user.save();

    const payload = { sub: newUser._id };
    const token = jwt.encode(payload, "123");

    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error saving user");
  }
}

// Route handler for user login
async function loginUser(req, res) {
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

// Create a new router
const router = express.Router();

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Export the router and middleware function
module.exports = {
  router,
  checkAuthenticated,
};
