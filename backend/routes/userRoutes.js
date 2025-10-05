// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ✅ CREATE USER
router.post("/", userController.createUser);

// ✅ GET ALL USERS (with search, sort, pagination)
router.get("/", userController.getUsers);

// ✅ GET SINGLE USER BY ID
router.get("/:id", userController.getUserById);

// ✅ UPDATE USER
router.put("/:id", userController.updateUser);

// ✅ SOFT DELETE USER
router.delete("/:id", userController.deleteUser);

module.exports = router;
