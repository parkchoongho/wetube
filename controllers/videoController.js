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

export const search = (req, res) => {
  const {
    query: { searchingBy }
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy, videoList });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  try {
    const {
      body: { title, description },
      file: { path }
    } = req;
    // console.log(req.file.path);
    // console.log(file, title, description);
    const newVideo = await Video.create({
      fileUrl: path,
      title,
      description,
      comments: []
    });
    // console.log(newVideo);
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    console.log(error);
    res.redirect(`/videos${routes.upload}`);
  }
};

export const videoDetail = (req, res) =>
  res.render("videoDetail", { pageTitle: "Video Detail" });

export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
