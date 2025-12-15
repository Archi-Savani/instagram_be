// utils/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Upload single image to Cloudinary
const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image", // image only
                folder: "Profile",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

module.exports = { uploadImage };
