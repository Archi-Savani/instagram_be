const express = require("express");
const multer = require("multer");
const { createPost, getPostsByUser } = require("../controllers/postController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // allow multipart with optional files

router.post("/", upload.any(), createPost);
router.get("/user/:userId", getPostsByUser);

module.exports = router;

