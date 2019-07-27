import "./db";
import "./models/Video";
import "./models/Comment";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅ Listening on port: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
