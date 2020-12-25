const express = require("express");
const auth = require("../middleware/auth");

const {
  createUser,
  loginUser,
  googleLogin,
  logoutUser,
  getItems,
  updateUser,
  deleteUser,
} = require("../controllers/users-controller");

const router = new express.Router();

// POST METHODS
router.post("/users", createUser);
router.post("/users/login", loginUser);
router.post("/users/login/google", googleLogin);
router.post("/users/logout", logoutUser);

// GET METHODS
router.get("/users/items", auth, getItems);

// PATCH METHODS //
router.patch("/users/profile", auth, updateUser);

// DELETE METHODS //
router.delete("/users/profile", auth, deleteUser);

module.exports = router;
