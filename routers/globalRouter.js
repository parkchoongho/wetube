import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  logout,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  githubLogin,
  postGithubLogin,
  getMe
} from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin); // githubLogin 함수가 사용자를 GitHub 사이트로 보내는 역할.
globalRouter.get(
  routes.githubCallback, // githubCallback URL로 들어오면 passport는 githubLoginCallback 함수를 실행한다.
  passport.authenticate("github", { failureRedirect: routes.login }),
  // 만약 유저를 찾으면, 쿠키를 생성하고 저정한 후, postGitHubLogin 함수를 실행하고 못 찾았으면 "/login"으로 리다이렉트 한다.
  postGithubLogin
);

globalRouter.get(routes.me, onlyPrivate, getMe);

export default globalRouter;
