import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videoList = await Video.find({});
    // console.log(videoList);
    res.render("home", { pageTitle: "Home", videoList });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videoList: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { searchingBy }
  } = req;
  let videoList = [];
  try {
    videoList = await Video.find({
      title: { $regex: searchingBy, $options: "-1" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videoList });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;
  try {
    // console.log(req.file.path);
    // console.log(file, title, description);
    const newVideo = await Video.create({
      fileUrl: path,
      title,
      description
    });
    // console.log(newVideo);
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    console.log(error);
    res.redirect(`/videos${routes.upload}`);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("videoDetail", { pageTitle: "Video Detail", video });
  } catch (err) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);

    res.render("editVideo", { pageTitle: "Edit Video", video });
  } catch (err) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (err) {
    console.log(err);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    await Video.findOneAndRemove(id);
    res.redirect(routes.home);
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};
