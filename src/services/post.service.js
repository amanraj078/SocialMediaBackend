const postModel = require("./../models/post.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app_constant = require("./../constant/app.json");
const jwt = require("jsonwebtoken");
const cloudinary = require("./../helpers/cloudinary");

exports.UploadPost = async (data, user_data) => {
    //check if email already exists or not
    const { _id } = user_data;
    const { file } = data;
    const file_url = await cloudinary.uploader.upload(file.path);
    const caption = data.caption ? data.caption : "";
    const upload_post = await postModel.create({
        file_url: file_url.url,
        caption: caption,
        user_id: _id,
    });

    if (upload_post) {
        return {
            success: 1,
            status_code: app_constant.SUCCESS,
            message: "Post uploaded successfuly",
            result: upload_post,
        };
    }
    return {
        success: 0,
        status_code: app_constant.INTERNAL_SERVER_ERROR,
        message: error.message,
        result: {},
    };
};
