# RouteProtection

### Avatar Multer

Avatar 파일 저장을 도와줄 multer를 생성한다.

localMiddlewares.js

```javascript
import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videoList/" });
const multerAvatar = multer({ dest: "uploads/avatar/" });

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const uploadMulter = multerVideo.single("videoFile");
export const avatarMulter = multerAvatar.single("avatar");
```

userController.js에서 postEditProfile controller 생성

```javascript
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl
    });
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    res.render("editProfile", { Pagetitle: "Edit Profile" });
  }
};
```

 `avatarUrl: file ? file.path : req.user.avatarUrl` 이 코드는 만약 변경하려는 이미지 파일이 있으면 그 파일의 경로로 변경하고 없으면 원래 있는 avatarUrl로 그대로 간다는 코드다.

userRouter.js 수정

```javascript
import express from "express";
import routes from "../routes";
import {
  userDetail,
  changePassword,
  getEditProfile,
  postEditProfile
} from "../controllers/userController";
import { onlyPrivate, avatarMulter } from "../localMiddlewares";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, avatarMulter, postEditProfile);

userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
```

editProfile.pug 수정

```jade
extends layouts/main

block content
    .form-container
        form(action=`/users${routes.editProfile}`, method="post", enctype="multipart/form-data")
            .fileUpload
                label(for="avatar") Avatar
                input(type="file", id="avatar", name="avatar", accept="image/*")
            input(type="text", name="name", placeholder="Name", value=loggedUser.name)
            input(type="email", name="email", placeholder="Email", value=loggedUser.email)
            input(type="submit", value="Update Profile")
```

