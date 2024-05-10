const express = require("express");
const router = express.Router();
const NoteController = require("../controllers/note.controller.js");
const auth = require("./auth.routes.js");

router.put("/:id", auth.checkAuthenticated, NoteController.update);
router.delete("/:id", auth.checkAuthenticated, NoteController.delete);
router.post("/", auth.checkAuthenticated, NoteController.create);
router.get("/", auth.checkAuthenticated, NoteController.getByParent);
router.delete(
  "/", // Route for deleting by parent ID
  auth.checkAuthenticated,
  NoteController.deleteByParent
);

module.exports = router;
