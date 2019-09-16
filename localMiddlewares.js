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
