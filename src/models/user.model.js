const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 40,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "Nothing to show",
    },
    profilepic: {
        type: String,
    },
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            default: [],
        },
    ],
    followings: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            default: [],
        },
    ],
});

const userModel = model("users", userSchema);
module.exports = userModel;
