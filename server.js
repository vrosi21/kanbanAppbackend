const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth.routes.js");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./routes/auth.routes.js").router;
app.use("/auth", authRoutes);

const wspRoutes = require("./routes/workspace.routes.js");
app.use("/workspaces", auth.checkAuthenticated, wspRoutes);

const brdRoutes = require("./routes/board.routes.js");
app.use("/boards", auth.checkAuthenticated, brdRoutes);

const ntRoutes = require("./routes/note.routes.js");
app.use("/notes", auth.checkAuthenticated, ntRoutes);

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
