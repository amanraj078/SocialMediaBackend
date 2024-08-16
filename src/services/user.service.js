const userModel = require("./../models/user.model");
const postModel = require("./../models/post.model");
const sendEmail = require("./../helpers/sendEmail");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app_constant = require("./../constant/app.json");
const jwt = require("jsonwebtoken");
const { toIST } = require("./../utils/DateTime");

const SECRET_KEY = process.env.SECRET_KEY;

exports.userSignUp = async (data) => {
    //check if email already exists or not
    const user_data = await userModel.findOne({ email: data.email });
    if (user_data) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Email already exist!",
            result: {},
        };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    const addUser = await userModel.create({ ...data, password: hashPassword });

    await sendEmail(data.email, data.username);
    return {
        success: 1,
        status: app_constant.SUCCESS,
        message: "user added successfully",
        result: addUser,
    };
};

exports.userLogin = async (data) => {
    const { email, password } = data;

    const user_data = await userModel.findOne({ email });

    if (!user_data) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Email does not exist!",
            result: {},
        };
    }

    const password_check = bcrypt.compareSync(password, user_data.password);

    if (!password_check) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Invalid Credentials!",
            result: {},
        };
    }

    const token = jwt.sign({ id: user_data._id }, SECRET_KEY);

    await userModel.updateOne({ _id: user_data }, { $set: { token } });

    return {
        success: 1,
        status: app_constant.SUCCESS,
        message: "user loggedin successfully",
        result: token,
    };
};

// exports.forgetPassword = async (data) => {

// }

exports.userProfile = async (data) => {
    const { id } = data;
    // const user_data = await userModel.findOne(
    //     { _id: id },
    //     { _id: 0, _v: 0, password: 0 }
    // );

    const [user_data, postCount] = await Promise.all([
        userModel.findOne({ _id: id }, { _id: 0, _v: 0, password: 0 }),
        postModel.countDocuments({ user_id: id }),
    ]);

    // const postCount = await postModel.countDocuments({ user_id: id });
    const result = JSON.parse(JSON.stringify(user_data));
    const follower_count = user_data.followers.length;
    const following_count = user_data.followings.length;

    result.followers_count = follower_count;
    result.followings_count = following_count;
    result.postCount = postCount;

    delete result.followers;
    delete result.followings;

    if (!user_data) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "User does not exist!",
            result: {},
        };
    }

    return {
        success: 1,
        status: app_constant.SUCCESS,
        message: "user loggedin successfully",
        // postCount,
        result: result,
    };
};

exports.followUser = async (data, auth_user_data) => {
    const auth_user_id = auth_user_data._id;
    const existing_followings = auth_user_data.followings;
    const follow_user_id = data.id;

    if (auth_user_id == follow_user_id) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Can not follow yourself!",
            result: {},
        };
    }

    const user_data = await userModel.findOne({ _id: follow_user_id });
    if (!user_data) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "User does not exist!",
            result: {},
        };
    }

    const follow_check = existing_followings.includes(follow_user_id);
    if (follow_check) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "User is already followed!",
            result: {},
        };
    }

    existing_followings.push(follow_user_id);
    user_data.followers.push(auth_user_id);

    const [update_follow_user, update_auth_user] = await Promise.all([
        userModel.updateOne(
            { _id: follow_user_id },
            { $set: { followers: user_data.followers } }
        ),
        userModel.updateOne(
            { _id: auth_user_id },
            { $set: { followings: existing_followings } }
        ),
    ]);

    if (update_follow_user && update_auth_user) {
        return {
            success: 1,
            status: app_constant.SUCCESS,
            message: "User followed successfully!",
            result: {},
        };
    }

    return {
        success: 0,
        status: app_constant.INTERNAL_SERVER_ERROR,
        message: "Internal server error!",
        result: {},
    };
};

exports.unfollowUser = async (data, auth_user_data) => {
    const auth_user_id = auth_user_data._id; //loggedin userid
    const existing_followings = auth_user_data.followings;
    const unfollow_user_id = data.id; //jisko unfollow krna h

    if (auth_user_id == unfollow_user_id) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "Can not unfollow yourself!",
            result: {},
        };
    }

    const user_data = await userModel.findOne({ _id: unfollow_user_id });
    if (!user_data) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "User does not exist!",
            result: {},
        };
    }

    const unfollow_check = existing_followings.includes(unfollow_user_id);
    if (unfollow_check) {
        return {
            success: 0,
            status: app_constant.BAD_REQUEST,
            message: "User is not followed!",
            result: {},
        };
    }
    console.log(unfollow_check);

    const updated_followings = existing_followings.filter(
        (id) => id != unfollow_user_id.toString
    );
    const updated_followers = user_data.followers.filter(
        (id) => id != auth_user_id.toString
    );

    // existing_followings.remove(unfollow_user_id);
    // user_data.followers.pop(auth_user_id);

    const [update_follow_user, update_auth_user] = await Promise.all([
        userModel.updateOne(
            { _id: unfollow_user_id },
            { $set: { followers: updated_followers } }
        ),
        userModel.updateOne(
            { _id: auth_user_id },
            { $set: { followings: updated_followings } }
        ),
    ]);

    // // Check if both updates were successful
    // if (update_follow_user.nModified > 0 && update_auth_user.nModified > 0) {
    //     return {
    //         success: 1,
    //         status: app_constant.SUCCESS,
    //         message: "User unfollowed successfully!",
    //         result: {},
    //     };
    // }

    return {
        success: 0,
        status: app_constant.INTERNAL_SERVER_ERROR,
        message: "Internal server error!",
        result: {},
    };
};

exports.getFollowersList = async (user_data, data) => {
    const { _id } = user_data;

    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : "";
    let search_query = {};

    const pipeline = [
        { $match: { _id: _id } },
        {
            $lookup: {
                from: "users",
                localField: "followers",
                foreignField: "_id",
                as: "followers_details",
            },
        },
        { $unwind: "$followers_details" },
        { $match: search_query },
    ];

    if (search) {
        const regex = new RegExp(search, "i");

        search_query = { "followers_details.username": regex };
    }

    const [result, total_count] = await Promise.all([
        userModel.aggregate([
            ...pipeline,
            {
                $project: {
                    _id: 0,
                    email: "$followers_details.email",
                    username: "$followers_details.username",
                },
            },
            { $skip: +offset },
            { $limit: Number(limit) },
        ]),
        userModel.aggregate([...pipeline, { $count: "total_count" }]),
    ]);

    if (result) {
        return {
            success: 1,
            status: app_constant.SUCCESS,
            message: "Followers list fetched successfully!",
            total_count: total_count.length ? total_count[0].total_count : 0,
            result,
        };
    }

    return {
        success: 0,
        status: app_constant.INTERNAL_SERVER_ERROR,
        message: "Internal server error!",
        result: {},
    };
};

exports.getFollowingList = async (user_data, data) => {
    const { followings } = user_data;

    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : "";
    const query = { _id: { $in: followings } };

    if (search) {
        const regex = new RegExp(search, "i");
        query["$or"] = [{ username: regex }, { email: regex }];
    }

    const total_count = await userModel.countDocuments(query);

    // const result = await User.findById(_id).select({ _id: 0, followings: 1 }).populate('followings')

    const result = await userModel
        .find(query)
        .select({ username: 1, email: 1, _id: 0 })
        .skip(offset)
        .limit(limit);

    if (result) {
        return {
            success: 1,
            status: app_constant.SUCCESS,
            message: "Following list fetched successfully!",
            total_count,
            result,
        };
    }

    return {
        success: 0,
        status: app_constant.INTERNAL_SERVER_ERROR,
        message: "Internal server error!",
        result: {},
    };
};

exports.getPostList = async (userId, data) => {
    // In a utility file (e.g., dateUtils.js)

    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : "";
    const query = { user_id: userId };

    if (search) {
        const regex = new RegExp(search, "i");
        query["$or"] = [{ caption: regex }];
    }

    const total_count = await postModel.countDocuments(query);

    const posts = await postModel
        .find(query)
        .select({
            file_url: 1,
            caption: 1,
            _id: 1,
            createdAt: 1,
            updatedAt: 1,
            like: 1,
        })
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

    const result = posts.map((post) => ({
        ...post.toObject(),
        createdAt: toIST(post.createdAt),
        updatedAt: toIST(post.updatedAt),
    }));

    if (result) {
        return {
            success: 1,
            status: app_constant.SUCCESS,
            message: "Post list fetched successfully!",
            total_count,
            result,
        };
    }

    return {
        success: 0,
        status: app_constant.INTERNAL_SERVER_ERROR,
        message: "Internal server error!",
        result: {},
    };
};
