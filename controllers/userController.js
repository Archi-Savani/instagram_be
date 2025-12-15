const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Post = require("../models/Post");

const buildToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
});

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const user = await User.create({ name, email, password });
        const token = buildToken(user._id);


        res.status(201).json({
            user: sanitizeUser(user),
            token,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Unable to register user." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = buildToken(user._id);

        res.json({
            user: sanitizeUser(user),
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Unable to login." });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const [profile, posts] = await Promise.all([
            Profile.findOne({ user: userId }).lean(),
            Post.find({ user: userId }).sort({ createdAt: -1 }).lean(),
        ]);

        res.json({
            user: sanitizeUser(user),
            profile,
            posts,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Unable to fetch user." });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
};


