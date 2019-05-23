import express from "express"; //import express
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { userRouter } from "./router";

const app = express(); // call express

const handleHome = (req, res) => res.send("Hello from home");

const handleProfile = (req, res) => res.send("You are on my profile.");
/*
const betweenHome = (req, res, next) => {
    console.log("Between!");
    next();
};

app.use(betweenHome);
*/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", handleHome);

app.get("/profile", handleProfile);

app.use("/user", userRouter);

export default app;