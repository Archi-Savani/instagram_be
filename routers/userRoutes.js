const express = require("express");
const {
    registerUser,
    loginUser,
    getUserById,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId", getUserById);

module.exports = router;


