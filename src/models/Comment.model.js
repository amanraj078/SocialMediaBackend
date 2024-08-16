const { Schema, model, default: mongoose } = require("mongoose");

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true,
        },
        post_id: {
            type: mongoose.Schema.ObjectId,
            ref: "post",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                default: [],
            },
        ],
        parent_id: {
            type: mongoose.Schema.ObjectId,
            ref: "comment",
            default: null,
        },
    },
    { timestamps: true }
);

const Comment = model("comment", commentSchema);
module.exports = Comment;
