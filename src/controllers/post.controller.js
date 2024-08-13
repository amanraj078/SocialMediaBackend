const app_constant = require("./../constant/app.json");
const postService = require("./../services/post.service");
const validationHelper = require("./../helpers/validation");
const fs = require("fs");

exports.UploadPost = async (req, res) => {
    try {
        // checking all the filled are given by the user or not
        if (!req.file) {
            return res.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: "please upload the file",
                result: {},
            });
        }

        req.body.file = req.file;

        // if all the filleds are filled then..
        const uploadPost = await postService.UploadPost(req.body, req.user);

        return res.json(uploadPost);
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

exports.UpdatePost = async (req, res) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["post_id"];
        const validation = validationHelper.validation(
            required_fields,
            req.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        req.body.file = req.file;

        // if all the filleds are filled then..
        const updatePost = await postService.UpdatePost(req.body, req.user);
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });

        return res.json(updatePost);
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

exports.LikePost = async (req, res) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["post_id"];
        const validation = validationHelper.validation(
            required_fields,
            req.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        // req.body.file = req.file;

        // if all the filleds are filled then..
        const likePost = await postService.LikePost(req.body, req.user);

        return res.json(likePost);
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

exports.UnlikePost = async (req, res) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["post_id"];
        const validation = validationHelper.validation(
            required_fields,
            req.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        // req.body.file = req.file;

        // if all the filleds are filled then..
        const unlikePost = await postService.UnlikePost(req.body, req.user);

        return res.json(unlikePost);
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};
