import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

const handleMongoOpen = () => console.log(`✔ DB Connected`);
const handleMongoError = error => console.log(`🚫 DB Connect Fail: ${error}`);

db.once("open", handleMongoOpen);
db.on("error", handleMongoError);
