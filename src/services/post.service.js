const postModel = require("./../models/post.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app_constant = require("./../constant/app.json");
const jwt = require("jsonwebtoken");
const cloudinary = require("./../helpers/cloudinary");
const fs = require("fs");

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
        fs.unlink(file.path, (err) => {
            console.log(err);
        });
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

exports.UpdatePost = async (data, user_data) => {
    //check if email already exists or not
    const { _id: userId } = user_data;
    const { file, post_id } = data;
    const caption = data.caption ? data.caption : "";

    const post_data = await postModel.findOne({ _id: post_id });
    // console.log(user_data.id);
    // console.log(post_data.user_id);
    if (!post_data) {
        return {
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        };
    }

    if (post_data.user_id.toString() !== userId.toString()) {
        return {
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: "post don't belong to you",
            result: {},
        };
    }

    const file_url = await cloudinary.uploader.upload(file.path);
    const update_post = await postModel.updateOne(
        { _id: post_id },
        { $set: { caption, file_url: file_url.url } }
    );

    if (update_post) {
        fs.unlink(file.path, (err) => {
            console.log(err);
        });
        return {
            success: 1,
            status_code: app_constant.SUCCESS,
            message: "Post updated successfuly",
            result: update_post,
        };
    }
    return {
        success: 0,
        status_code: app_constant.INTERNAL_SERVER_ERROR,
        message: error.message,
        result: {},
    };
};

exports.LikePost = async (data, user_data) => {
    //check if email already exists or not
    const { _id: userId } = user_data;
    const { post_id } = data;
    // const caption = data.caption ? data.caption : "";

    const post_data = await postModel.findOne({ _id: post_id });
    // console.log(user_data.id);
    // console.log(post_data.user_id);
    if (!post_data) {
        return {
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        };
    }

    const like_check = post_data.like.includes(userId);
    if (like_check) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Post is already liked",
            result: {},
        };
    }
    post_data.like.push(userId);

    // const file_url = await cloudinary.uploader.upload(file.path);
    const like_post = await postModel.updateOne(
        { _id: post_id },
        { $set: { like: post_data.like } }
    );

    if (like_post) {
        return {
            success: 1,
            status_code: app_constant.SUCCESS,
            message: "Post liked successfuly",
            result: like_post,
        };
    }
    return {
        success: 0,
        status_code: app_constant.INTERNAL_SERVER_ERROR,
        message: error.message,
        result: {},
    };
};

exports.UnlikePost = async (data, user_data) => {
    //check if email already exists or not
    const { _id: userId } = user_data;
    const { post_id } = data;
    // const caption = data.caption ? data.caption : "";

    const post_data = await postModel.findOne({ _id: post_id });
    // console.log(user_data.id);
    // console.log(post_data.user_id);
    if (!post_data) {
        return {
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        };
    }

    const like_check = post_data.like.includes(userId);
    if (!like_check) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Post is not liked by the user",
            result: {},
        };
    }

    // Unlike the post
    const unlike_post = await postModel.updateOne(
        { _id: post_id },
        { $pull: { like: userId } }
    );

    if (unlike_post.modifiedCount > 0) {
        return {
            success: 1,
            status_code: app_constant.SUCCESS,
            message: "Post unliked successfully",
            result: unlike_post,
        };
    }
    return {
        success: 0,
        status_code: app_constant.INTERNAL_SERVER_ERROR,
        message: error.message,
        result: {},
    };
};
