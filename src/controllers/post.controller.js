const app_constant = require("./../constant/app.json");
const postService = require("./../services/post.service");
const validationHelper = require("./../helpers/validation");

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
