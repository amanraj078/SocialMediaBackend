const express = require("express");
const postController = require("./../controllers/post.controller");
const PostRouter = express.Router();
const middleware = require("./../middlewares/Auth.Middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

PostRouter.post(
    "/upload",
    middleware.verifyToken,
    upload.single("file"),
    postController.UploadPost
);

module.exports = PostRouter;
