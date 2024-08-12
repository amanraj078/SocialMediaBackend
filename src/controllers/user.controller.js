const express = require("express");
const app_constant = require("./../constant/app.json");
const userService = require("./../services/user.service");
const validationHelper = require("./../helpers/validation");

//^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
exports.UserSignUp = async (request, response) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["username", "email", "password"];
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

        const validEmail = validationHelper.validEmail(request.body.email);

        if (!validEmail) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: "Invalid Email",
                result: {},
            });
        }

        // if all the filleds are filled then..
        const addUser = await userService.userSignUp(request.body);

        return response.json(addUser);
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

exports.UserLogin = async (request, response) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["email", "password"];
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
        // if all the filleds are filled then..
        const loginUser = await userService.userLogin(request.body);

        return response.json(loginUser);
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

exports.UserProfile = async (request, response) => {
    try {
        const required_fields = ["id"];
        const validation = validationHelper.validation(
            required_fields,
            request.params
        );

        if (Object.keys(validation).length) {
            return response.json({
                success: 0,
                status_code: app_constant.BAD_REQUEST,
                message: validation,
                result: {},
            });
        }
        // if all the filleds are filled then..
        const getUser = await userService.userProfile(request.params);

        return response.json(getUser);
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

exports.Follow = async (request, response) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["id"];
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
        // if all the filleds are filled then..
        const followUser = await userService.followUser(
            request.body,
            request.user
        );

        return response.json(followUser);
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

exports.Unfollow = async (request, response) => {
    try {
        // checking all the filled are given by the user or not
        const required_fields = ["id"];
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
        // if all the filleds are filled then..
        const unfollowUser = await userService.unfollowUser(
            request.body,
            request.user
        );

        return response.json(unfollowUser);
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

exports.FollowersList = async (request, response) => {
    try {
        // if all the filleds are filled then..
        const getUser = await userService.getFollowersList(
            request.user,
            request.query
        );

        return response.json(getUser);
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

exports.FollowingList = async (request, response) => {
    try {
        // if all the filleds are filled then..
        const getUser = await userService.getFollowingList(
            request.user,
            request.query
        );

        return response.json(getUser);
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
