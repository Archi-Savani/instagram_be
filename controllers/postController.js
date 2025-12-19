const Post = require("../models/Post");
const User = require("../models/User");
const { uploadImage } = require("../utils/upload");

// Create a post
const createPost = async (req, res) => {
    try {
        const { userId, caption } = req.body || {};
        let { image } = req.body || {};

        // If a file is uploaded, send buffer to Cloudinary
        if (!image && req.files && req.files.length > 0) {
            const uploadResult = await uploadImage(req.files[0].buffer);
            image = uploadResult.url;
        }

        if (!userId || !image) {
            return res
                .status(400)
                .json({ message: "userId and image are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const post = await Post.create({
            user: userId,
            image,
            caption,
        });

        res.status(201).json({ post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Unable to create post." });
    }
};

// Get posts by user id
const getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Unable to fetch posts." });
    }
};

// Get all posts of all users
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email") // include basic user info
            .lean();

        res.json({ posts });
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ message: "Unable to fetch posts." });
    }
};

module.exports = {
    createPost,
    getPostsByUser,
    getAllPosts,
};

