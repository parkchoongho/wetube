import express from "express";
import routes from "../routes";
import {
  userDetail,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePasssword
} from "../controllers/userController";
import { onlyPrivate, avatarMulter } from "../localMiddlewares";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, avatarMulter, postEditProfile);

userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePasssword);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
