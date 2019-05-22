import express from "express"; //import express
const app = express(); // call express

const PORT = 4000;

const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`);

const handleHome = (req, res) => res.send("Hello from home");

const handleProfile = (req, res) => res.send("You are on my profile.");

app.get("/", handleHome);

app.get("/profile", handleProfile);

app.listen(PORT, handleListening);
