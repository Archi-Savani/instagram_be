const { Schema, model, Types } = require("mongoose");

const profileSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        image: {
            type: String,
        },
        bio: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Profile", profileSchema);

