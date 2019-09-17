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

### Edit User & Change Password

패스워드는 텍스트 그대로 저장되지 않는다. (노출되서는 안되는 정보이기에 항상 암호화 되서 저장되어야한다.)

```javascript
export const getChangePassword = (req, res) =>
res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, veriPassword }
    } = req;
    try {
        if (newPassword !== veriPassword) {
            res.status(400);
            res.redirect(routes.changePassword);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        // 이렇게 비밀번호를 바꿀 수 있다. changePassword method는 어떻게 나왔는지 공부할 것
        res.redirect(routes.me);
    } catch (error) {
        res.status(400);
        res.redirect(routes.changePassword);
    }
};
```

### Adding Creator to Videos

이제 비디오 모델에 누가 이 비디오를 업로드 했는지를 추가해야한다. 

videoController의 postUpload 함수 컨트롤러에서 req에서 user.id를 가져와 creator에 추가한다. (passport 덕에 req에 계속 user가 담겨있다.)

```javascript
export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};
```

 populate는 객체를 가져오는 함수이다. populate는 오직 objectId 타입에만 쓰일 수 있다.

아래와 같이 코드를 짜면 creator는 더 이상 id가 아닌 객체 하나가 된다. 따라서 여기에서 username을 가져올 수 있다.

videoDetail 함수 컨트롤러

```javascript
export const videoDetail = async (req, res) => {
    console.log(req.user);
    const {
        params: { id }
    } = req;

    try {
        const video = await Video.findById(id).populate("creator");
        console.log(video);
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};
```

내가 올린 비디오를 다른 계정이 편집할 수 없도록 하는 작업이 필요하다.

videoDetail.pug

```jade
extends layouts/main

block content
    .video-detail__container
        .video__player
            video(src=`/${video.fileUrl}`)
        .video__info
            if video.creator.id === loggedUser.id
                a(href=routes.editVideo(video.id))
                    button Edit video
            h5.video__title=video.title
            p.video__description=video.description
            if video.views === 1
                span.video__views 1 view
            else 
                span.video__views #{video.views} views
            .video__author
                |Uploaded By 
                a(href=routes.userDetail(video.creator.id))=video.creator.name
        .video__comments
            if video.comments.length === 1
                span.video__comment-number 1 comment
            else
                span.video__comment-number #{video.comments.length} comments
```

### Protecting Video Routes

현재 상황에서 url에 /edit으로 입력해서 접근하면 권한이 없는 계정이 비디오를 수정할 수 있다. (Edit Video라는 버튼은 보이지 않아도 Url로 접근, delete도 /delete를 통해 권한이 없는 계정이 접근해 비디오를 삭제 할 수 있다.) 따라서 Video Controller를 수정

getEditVideo, deleteVideo 함수 컨트롤러를 수정

```javascript
export const getEditVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id).populate("creator");

        if (video.creator.id !== req.user.id) {
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id).populate("creator");
        if (video.creator.id !== req.user.id) {
            throw Error();
        } else {
            await Video.findOneAndRemove({ _id: id });
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};
```

또한, userDetail 페이지에서 다른 계정이 올린 비디오 목록을 보고 또한 자신의 userDetail 페이지에서 자신이 올린 비디오 계정을 볼 수 있게 코드 수정

userController에서 getMe 함수 컨트롤러와 userDetail 함수 컨트로럴 수정

```javascript
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const userDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};
```

userDetail.pug를 아래와 같이 코드 추가

```jade
extends layouts/main
include mixins/videoBlock

block content
    .user-profile
        .user-profile__header
            img.u-avatar(src=user.avatarUrl)
            h4.profile__username=user.name
        if user.id === loggedUser.id
            .user-profile__btns
                a(href=`/users${routes.editProfile}`)
                    button ✏️ Edit Profile
                a(href=`/users${routes.changePassword}`)
                    button 🔒 Change Password 
        .home-videos
            each item in user.videos
                +videoBlock({
                    id:item.id,
                    title:item.title,
                    views:item.views,
                    videoFile:item.fileUrl
                })
```

### loggedUser가 Null이어서 발생하는 오류 수정

로그인을 안한 상태에서 개별 비디오로 들어가면 오류가 발생한다. 왜냐하면 loggedUser의 값이 NULL이기에 pug에서 읽어들이지 못하기 때문이다. 개별 계정으로 들어가도 같은 오류가 발생한다. 따라서 userDetail.pug 파일과 videoDetail.pug 파일을 수정한다.

userDetail.pug 수정

```jade
extends layouts/main
include mixins/videoBlock

block content
    .user-profile
        .user-profile__header
            img.u-avatar(src=user.avatarUrl)
            h4.profile__username=user.name
        if loggedUser && user.id === loggedUser.id
            .user-profile__btns
                a(href=`/users${routes.editProfile}`)
                    button ✏️ Edit Profile
                a(href=`/users${routes.changePassword}`)
                    button 🔒 Change Password 
        .home-videos
            each item in user.videos
                +videoBlock({
                    id:item.id,
                    title:item.title,
                    views:item.views,
                    videoFile:item.fileUrl
                })
```

videoDetail.pug 수정

```jade
extends layouts/main

block content
    .video-detail__container
        .video__player
            video(src=`/${video.fileUrl}`)
        .video__info
            if loggedUser && video.creator.id === loggedUser.id
                a(href=routes.editVideo(video.id))
                    button Edit video
            h5.video__title=video.title
            p.video__description=video.description
            if video.views === 1
                span.video__views 1 view
            else 
                span.video__views #{video.views} views
            .video__author
                |Uploaded By 
                a(href=routes.userDetail(video.creator.id))=video.creator.name
        .video__comments
            if video.comments.length === 1
                span.video__comment-number 1 comment
            else
                span.video__comment-number #{video.comments.length} comments
```

