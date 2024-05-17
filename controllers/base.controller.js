class BaseController {
  constructor(model) {
    this.model = model;

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteByParent = this.deleteByParent.bind(this);
    this.getByParent = this.getByParent.bind(this);
  }

  //   async getById(req, res) {
  //     const id = req.params.id;
  //     try {
  //       const item = await this.model.findById(id).select("-__v -pwd");
  //       if (!item) {
  //         return res.status(404).send({ message: "Item not found" });
  //       }
  //       res.send(item);
  //     } catch (error) {
  //       console.error(error);
  //       res
  //         .status(500)
  //         .send({ message: "An error occurred while trying to fetch the item" });
  //     }
  //   }

  async create(req, res) {
    const item = new this.model(req.body);
    const errors = item.validateSync();
    if (errors) return res.status(400).json(errors);

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

  async update(req, res) {
    const id = req.params.id;
    const itemData = req.body;

    const item = new this.model(itemData);
    const errors = item.validateSync();
    if (errors) return res.status(400).json(errors);

    try {
      const item = await this.model.findByIdAndUpdate(id, itemData, {
        new: true,
      });
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while trying to update the item" });
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const item = await this.model.findByIdAndDelete(id);
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while trying to delete the item" });
    }
  }

  async deleteByParent(req, res) {
    const { parent } = req.query;

    try {
      await this.model.deleteMany({ parent });

      res.status(200).send({ message: "Documents deleted successfully" });
    } catch (error) {
      console.error("Error deleting documents:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }

  async getByParent(req, res) {
    const { parent } = req.query;
    try {
      const items = await this.model.find({ parent });
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching items by parent:", error);
      res.status(500).json({ error: "Error fetching items by parent" });
    }
  }
}

module.exports = BaseController;
