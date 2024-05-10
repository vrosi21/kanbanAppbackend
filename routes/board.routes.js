const express = require("express");
const router = express.Router();
const BoardController = require("../controllers/board.controller.js");
const auth = require("./auth.routes.js");

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
