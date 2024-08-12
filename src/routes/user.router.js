const express = require("express");
const userController = require("./../controllers/user.controller");
const UserRouter = express.Router();
const middleware = require("./../middlewares/Auth.Middleware");

UserRouter.post("/signup", userController.UserSignUp);
UserRouter.post("/login", userController.UserLogin);
UserRouter.get(
    "/profile/:id",
    middleware.verifyToken,
    userController.UserProfile
);
UserRouter.post("/follow", middleware.verifyToken, userController.Follow);
UserRouter.post("/unfollow", middleware.verifyToken, userController.Unfollow);
UserRouter.get(
    "/followers",
    middleware.verifyToken,
    userController.FollowersList
);
UserRouter.get(
    "/followings",
    middleware.verifyToken,
    userController.FollowingList
);
UserRouter.get("/postList", middleware.verifyToken, userController.PostsList);

module.exports = UserRouter;
