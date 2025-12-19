const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Post", postSchema);


