const express = require("express");
const {
  deleteSection,
  updateSection,
  getAllItems,
  getAllSections,
  createSection,
} = require("../controllers/sections-controller");

const router = new express.Router();

// POST METHODS
router.post("/sections", createSection);

// GET METHODS //
router.get("/sections", getAllSections);
router.get("/sections/:title/items", getAllItems);

// PATCH METHODS //
router.patch("/sections/:id", updateSection);

// DELETE METHODS //
router.delete("/sections/:id", deleteSection);

module.exports = router;
