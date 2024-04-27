var bcrypt = require("bcrypt");
var jwt = require("jwt-simple");

var User = require("./models/User.js");

function checkAuthenticated(req, res, next) {
  if (!req.header("authorization"))
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing auth header." });
  var token = req.header("authorization").split(" ")[1];

  var payload = jwt.decode(token, "123");
  if (!payload)
    return res
      .status(401)
      .send({ message: "Unauthorized: Auth header invalid." });

  req.userId = payload.sub;

  next();
}

var router = require("express").Router();

router.post("/register", (req, res) => {
  var userData = req.body;

  var user = new User(userData);

  user
    .save()
    .then((newUser) => {
      console.log("User saved successfully:", newUser);
      var payload = { sub: newUser._id };
      var token = jwt.encode(payload, "123");

      res.status(200).send({ token: token });
    })
    .catch((error) => {
      console.error("Error saving user:", error);
      res.status(500).send("Error saving user");
    });
});

router.post("/login", async (req, res) => {
  var userData = req.body;

  try {
    var user = await User.findOne({ email: userData.email });

    if (!user) return res.status(401).send({ message: "Email doesn't exist." });

    bcrypt.compare(userData.password, user.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(401).send({ message: "Password invalid." });

      var payload = { sub: user._id };
      var token = jwt.encode(payload, "123");

      res.status(200).send({ token: token });
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).send("Error finding user");
  }
});

module.exports = { router, checkAuthenticated };
