const jwt = require("jwt-simple");
const express = require("express");
const UserController = require("../controllers/user.controller.js");

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

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

module.exports = {
  router,
  checkAuthenticated,
};
