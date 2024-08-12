const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config();
exports.verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization);
    if (!authorization) {
        res.json({
            success: 0,
            status_code: 401,
            message: "Please passs the token",
            result: {},
        });
    }
    const token = authorization.replace("Bearer ", "");

    const verify_token = jwt.verify(token, process.env.SECRET_KEY);
    if (!verify_token) {
        return res.json({
            success: 0,
            status_code: 401,
            message: "Inavalid token",
            result: {},
        });
    }

    const { id } = verify_token;
    const user_data = await userModel.findById(id);
    req.user = user_data;
    next();
};
