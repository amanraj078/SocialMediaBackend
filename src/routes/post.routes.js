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

PostRouter.post(
    "/update",
    middleware.verifyToken,
    upload.single("file"),
    postController.UpdatePost
);

PostRouter.post("/like", middleware.verifyToken, postController.LikePost);
PostRouter.post("/unlike", middleware.verifyToken, postController.UnlikePost);

module.exports = PostRouter;
