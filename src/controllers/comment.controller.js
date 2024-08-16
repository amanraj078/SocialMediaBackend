const app_constant = require("../constant/app.json");
const commentService = require("../services/comment.service");
const validationHelper = require("../helpers/validation");
const fs = require("fs");

// API to add a comment
exports.addComment = async (request, response) => {
    try {
        const required_fields = ["post_id", "comment"];
        const validation = validationHelper.validation(
            required_fields,
            request.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        const add_comment = await commentService.addComment(
            request.body,
            request.user
        );
        return response.json(add_comment);
    } catch (error) {
        console.log(error);
        response.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

// API to get comment list of a post
exports.getCommentList = async (request, response) => {
    try {
        const required_fields = ["post_id"];
        const validation = validationHelper.validation(
            required_fields,
            request.query
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        const comment_list = await commentService.getCommentList(request.query);
        return response.json(comment_list);
    } catch (error) {
        console.log(error);
        response.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

// API to like a comment
exports.likeComment = async (request, response) => {
    try {
        const required_fields = ["comment_id"];
        const validation = validationHelper.validation(
            required_fields,
            request.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        const data = await commentService.likeComment(
            request.body,
            request.user
        );
        return response.json(data);
    } catch (error) {
        console.log(error);
        response.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};

// API to unlike a comment
exports.unlikeComment = async (request, response) => {
    try {
        const required_fields = ["comment_id"];
        const validation = validationHelper.validation(
            required_fields,
            request.body
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }

        const data = await commentService.unlikeComment(
            request.body,
            request.user
        );
        return response.json(data);
    } catch (error) {
        console.log(error);
        response.json({
            success: 0,
            status_code: app_constant.INTERNAL_SERVER_ERROR,
            message: error.message,
            result: {},
        });
    }
};
