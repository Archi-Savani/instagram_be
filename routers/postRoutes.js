const express = require("express");
const multer = require("multer");
const {
    createPost,
    getPostsByUser,
    getAllPosts,
} = require("../controllers/postController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // allow multipart with optional files

// Create post
router.post("/", upload.any(), createPost);

// Get all posts of all users
router.get("/", getAllPosts);

// Get posts for a specific user
router.get("/user/:userId", getPostsByUser);

module.exports = router;

