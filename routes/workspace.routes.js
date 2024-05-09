const express = require("express");
const router = express.Router();
const auth = require("./auth.routes.js");
var WorkspaceController = require("../controllers/workspace.controller");

// Define routes
router.get("/", auth.checkAuthenticated, WorkspaceController.getByAuthor);
router.post(
  "/",
  auth.checkAuthenticated,
  WorkspaceController.createWithTemplate
);
router.put("/:id", auth.checkAuthenticated, WorkspaceController.update);
router.delete("/:id", auth.checkAuthenticated, WorkspaceController.delete);

module.exports = router;
