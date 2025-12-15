const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImage } = require("../utils/upload");

// Create or update a profile for a user
const upsertProfile = async (req, res) => {
    try {
        const { userId, bio } = req.body || {};
        let { image } = req.body || {};

        // If a file is uploaded, send buffer to Cloudinary
        if (!image && req.files && req.files.length > 0) {
            const uploadResult = await uploadImage(req.files[0].buffer);
            image = uploadResult.url;
        }

        if (!userId) {
            return res.status(400).json({ message: "userId is required." });
        }

        if (!image) {
            return res.status(400).json({ message: "image is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { image, bio },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ message: "Unable to save profile." });
    }
};

// Fetch profile by user id
const getProfileByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Profile.findOne({ user: userId }).populate(
            "user",
            "name email"
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        res.json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Unable to fetch profile." });
    }
};

module.exports = {
    upsertProfile,
    getProfileByUser,
};
