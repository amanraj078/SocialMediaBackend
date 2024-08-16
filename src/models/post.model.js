const { default: mongoose, model, Schema } = require("mongoose");

const postSchema = new Schema(
    {
        file_url: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
        },
        user_id: {
            type: Schema.ObjectId,
            ref: "user",
            required: true,
        },
        like: [
            {
                type: Schema.ObjectId,
                ref: "user",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const postModel = model("post", postSchema);
module.exports = postModel;
