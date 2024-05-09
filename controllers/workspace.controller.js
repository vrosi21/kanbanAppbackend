const Workspace = require("../models/Workspace.js");
const Board = require("../models/Board.js");
const jwt = require("jwt-simple");
const BaseController = require("./base.controller.js");
const WorkspaceTemplate = require("../templates/workspace.template.js");

class WorkspaceController extends BaseController {
  constructor() {
    super(Workspace);

    this.createWithTemplate = this.createWithTemplate.bind(this);
    this.getByAuthor = this.getByAuthor.bind(this);
  }

  async createWithTemplate(req, res) {
    req.body.author = req.userId;
    const workspace = new this.model(req.body);

    try {
      await workspace.save();

      // Create boards for the newly created workspace
      const currentWsp = workspace._id; // Get the id of the current workspace
      const savedBoards = await Promise.all(
        WorkspaceTemplate.map(async (board) => {
          const newBoard = new Board({
            ...board,
            parent: currentWsp,
          });
          return await newBoard.save();
        })
      );

      res.status(200).send({ workspace, boards: savedBoards });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while trying to create the item" });
    }
  }

  async getByAuthor(req, res) {
    try {
      const authHeader = req.header("authorization");
      if (!authHeader) {
        return res.status(401).send("Authorization header missing");
      }
      const token = authHeader.split(" ")[1];
      const payload = jwt.decode(token, "123");
      if (!payload) {
        return res.status(401).send("Invalid token");
      }
      const author = payload.sub;

      const workspaces = await Workspace.find({ author });

      res.send(workspaces);
    } catch (error) {
      console.error("Error loading workspaces:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).send("Invalid or expired token");
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).send("Token expired");
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(400).send("Invalid user ID in token payload");
      } else {
        res.status(500).send("Error loading workspaces");
      }
    }
  }

  async create(req, res) {
    req.body.author = req.userId;
    const item = new this.model(req.body);

    const errors = item.validateSync();
    /*if (errors) {
      const validationError = generateValidationErrors(errors);
      return res.status(400).send(validationError);
    }*/

    try {
      await item.save();
      res.status(200).send(item);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while trying to create the item" });
    }
  }
  // async getByAuthor(req, res) {
  //     const author = req.params.author;
  //     try {
  //         const items = await Message.find({ author }).select("-__v").populate('category');
  //         res.status(200).send(items);
  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).send({ message: "An error occurred while trying to get the items" });
  //     }
  // }

  // deleteAll(req, res) {
  //     Message.deleteMany({}, (err) => {
  //         if (err) {
  //             console.error(err);
  //             res.status(500).send({ message: "An error occurred while trying to delete the items" });
  //         } else {
  //             res.status(200).send({ message: "Items deleted" });
  //         }
  //     });
  // }
}

module.exports = new WorkspaceController();
