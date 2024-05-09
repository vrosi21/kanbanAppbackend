const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const Board = require("../models/Workspace.js");
const BoardController = require("../controllers/board.controller.js");
const auth = require("./auth.routes.js");

// Route handler for creating a new board
async function createBoard(req, res) {
  try {
    // Extract user ID from the token
    const token = req.header("authorization").split(" ")[1];
    const payload = jwt.decode(token, "123");
    const author = payload.sub; // Assuming the user ID is stored in 'sub' field

    // Create a new board
    const boardData = req.body;
    boardData.author = author; // Set the author of the board

    const board = new Board(boardData);
    const result = await board.save();

    // Send JSON response with the created board data
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Error creating board" });
  }
}

// Route handler for updating a board
async function updateBoard(req, res) {
  try {
    const boardId = req.params.id;
    const newData = req.body;

    // Update the board by its ID
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      newData,
      { new: true } // Return the updated document
    );

    // If the board doesn't exist, return 404
    if (!updatedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Send the updated board data in the response
    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Error updating board" });
  }
}

// Route handler for deleting a board
async function deleteBoard(req, res) {
  try {
    const boardId = req.params.id;

    // Delete the board by its ID
    const result = await Board.findByIdAndDelete(boardId);

    // If the board doesn't exist, return 404
    if (!result) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Send an empty response indicating successful deletion
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Error deleting board" });
  }
}

// Define routes
router.put("/:id", auth.checkAuthenticated, BoardController.update);
router.delete("/:id", auth.checkAuthenticated, BoardController.delete);
router.post("/", auth.checkAuthenticated, BoardController.create);
router.get("/", auth.checkAuthenticated, BoardController.getByParent);
router.delete(
  "/", // Route for deleting by parent ID
  auth.checkAuthenticated,
  BoardController.deleteByParent
);

module.exports = router;
