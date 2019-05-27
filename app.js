import express from "express"; //import express
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import routes from "./routes";

const app = express(); // call express

app.set("view engine", "pug");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(helmet());
app.use(morgan("dev"));

app.use(routes.home, globalRouter); // 전역적 Router
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;