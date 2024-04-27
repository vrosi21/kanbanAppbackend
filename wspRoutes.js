const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const Workspace = require("./models/Workspace.js");
const auth = require("./auth.js");

router.get("/workspaces", auth.checkAuthenticated, async (req, res) => {
  try {
    // Decode the token to extract the user ID
    const token = req.header("authorization").split(" ")[1];
    const payload = jwt.decode(token, "123");
    const author = payload.sub; // Assuming the user ID is stored in 'sub' field

    // Find workspaces with the author's ID
    const workspaces = await Workspace.find({ author });

    res.send(workspaces);
  } catch (error) {
    console.error("Error loading workspaces:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      // Invalid or expired token
      res.status(401).send("Invalid or expired token");
    } else if (error instanceof jwt.TokenExpiredError) {
      // Token expired
      res.status(401).send("Token expired");
    } else if (error instanceof mongoose.Error.CastError) {
      // Invalid user ID in token payload
      res.status(400).send("Invalid user ID in token payload");
    } else {
      // Other unexpected errors
      res.status(500).send("Error loading workspaces");
    }
  }
});

router.post("/workspace", auth.checkAuthenticated, (req, res) => {
  var wsData = req.body;
  wsData.author = req.userId;

  var workspace = new Workspace(wsData);

  workspace
    .save()
    .then((result) => {
      console.log("Workspace saved successfully:", result);
      // Send JSON response with the created workspace data
      res.status(201).json(result);
    })
    .catch((error) => {
      console.error("Error saving workspace:", error);
      res.status(500).json({ error: "Error saving workspace" });
    });
});

router.delete("/workspace/:id", auth.checkAuthenticated, async (req, res) => {
  try {
    const workspaceId = req.params.id;

    // Check if the workspace ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    // Delete the workspace by its ID
    const result = await Workspace.findByIdAndDelete(workspaceId);

    // If the workspace doesn't exist, return 404
    if (!result) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Send an empty response indicating successful deletion
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting workspace:", error);
    res.status(500).json({ error: "Error deleting workspace" });
  }
});

module.exports = router;
