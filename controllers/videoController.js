import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

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
    const newVideo = await Video.create({
      fileUrl: path,
      title,
      description,
      creator: req.user.id
    });
    req.user.videos.push(newVideo);
    req.user.save();
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
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    console.log(video);
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
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: "Edit Video", video });
    }
  } catch (error) {
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
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove(id);
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const registerView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
};

// Add a Comment

export const addComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    user.comments.push(newComment.id);
    user.save();
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
