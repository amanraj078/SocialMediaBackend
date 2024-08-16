// routes/postRoutes.js
const express = require("express");
const commentRouter = express.Router();
const commentControllers = require("../controllers/comment.controller");
const middleware = require("./../middlewares/Auth.Middleware");

commentRouter.post(
    "/add",
    middleware.verifyToken,
    commentControllers.addComment
);
commentRouter.get(
    "/list",
    middleware.verifyToken,
    commentControllers.getCommentList
);
commentRouter.post(
    "/like",
    middleware.verifyToken,
    commentControllers.likeComment
);
commentRouter.post(
    "/unlike",
    middleware.verifyToken,
    commentControllers.unlikeComment
);

module.exports = commentRouter;
