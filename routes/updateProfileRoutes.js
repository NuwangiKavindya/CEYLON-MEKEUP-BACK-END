const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

const router = express.Router();

// Get profile
router.get("/:email", getUserProfile);

// Update profile
router.put("/:email", updateUserProfile);

module.exports = router;
