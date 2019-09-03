import { videoList } from "../db";
import routes from "../routes";

export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videoList });
};

export const search = (req, res) => {
  console.log(req.query);
  const {
    query: { searchingBy }
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy, videoList });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = (req, res) => {
  console.log(req.body);
  const {
    body: { file, title, description }
  } = req;
  // TO DO: Upload and Save Video
  res.redirect(routes.videoDetail(324393));
};

export const videoDetail = (req, res) =>
  res.render("videoDetail", { pageTitle: "Video Detail" });

export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
