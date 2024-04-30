const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define routes for authentication
const authRoutes = require("./routes/auth.js").router;
app.use("/auth", authRoutes);

// Define routes for workspace
const wspRoutes = require("./routes/wsp.js");
app.use("/api", auth.checkAuthenticated, wspRoutes); // Protected workspace routes

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://moke15x:DBpass123@cluster0.9whi3rv.mongodb.net/kanbanly"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = app;
