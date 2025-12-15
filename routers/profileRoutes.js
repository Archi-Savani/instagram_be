const express = require("express");
const multer = require("multer");
const {
    upsertProfile,
    getProfileByUser,
} = require("../controllers/profileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // allow multipart with optional files

router.post("/", upload.any(), upsertProfile);
router.get("/:userId", getProfileByUser);

module.exports = router;

