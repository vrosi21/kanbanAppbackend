const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const Workspace = require("../models/Workspace.js");
const auth = require("./auth.js");

// Route handler for getting workspaces
async function getWorkspaces(req, res) {
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
}

// Route handler for creating a new workspace
async function createWorkspace(req, res) {
  var wsData = req.body;
  wsData.author = req.userId;

  var workspace = new Workspace(wsData);

  try {
    const result = await workspace.save();
    // Send JSON response with the created workspace data
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving workspace:", error);
    if (error.name === "ValidationError") {
      // Handle validation errors
      res.status(400).json({ error: error.message });
    } else {
      // Other unexpected errors
      res.status(500).json({ error: "Error saving workspace" });
    }
  }
}

// Route handler for renaming a workspace title
async function renameWorkspace(req, res) {
  try {
    const workspaceId = req.params.id;
    const newTitle = req.body.newTitle;

    // Check if the workspace ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    // Find the workspace by its ID and update the title
    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      { title: newTitle },
      { new: true } // Return the updated document
    );

    // If the workspace doesn't exist, return 404
    if (!updatedWorkspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Send the updated workspace data in the response
    res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.error("Error renaming workspace:", error);
    res.status(500).json({ error: "Error renaming workspace" });
  }
}

// Route handler for deleting a workspace
async function deleteWorkspace(req, res) {
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
}

// Define routes
router.get("/workspaces", auth.checkAuthenticated, getWorkspaces);
router.post("/workspace", auth.checkAuthenticated, createWorkspace);
router.put("/workspace/:id/rename", auth.checkAuthenticated, renameWorkspace);
router.delete("/workspace/:id", auth.checkAuthenticated, deleteWorkspace);

module.exports = router;
