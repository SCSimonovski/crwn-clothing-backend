const express = require("express");
const auth = require("../middleware/auth");
const {
  createItem,
  addAllItem,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/items-controller");

const router = new express.Router();

// POST METHODS
router.post("/items", createItem);
router.post("/items/section", addAllItem);

// GET METHODS
router.get("/items/:id", getItemById);

// PATCH METHODS
router.patch("/items/:id", updateItem);

// DELETE METHODS
router.delete("/items/:id", deleteItem);

module.exports = router;
