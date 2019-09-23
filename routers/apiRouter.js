import express from "express";
import routes from "../routes";
import { registerView, addComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, addComment);

export default apiRouter;
