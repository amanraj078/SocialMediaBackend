const { default: mongoose, Schema } = require("mongoose");

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user_id: {
            type: Schema.ObjectId,
            ref: "user",
            required: true,
        },
        like: {
            type: Schema.ObjectId,
            ref: "user",
            default: [],
        },
        comments: [{ type: Schema.ObjectId, ref: "comment", default: [] }],
    },
    { timestamps: true }
);

const commentModel = model("comment", commentSchema);
module.exports = commentModel;
