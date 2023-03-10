import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import codeSnippetsRoutes from "./routes/codeSnippet.js";
import ytDownloaderRoutes from "./routes/youtubeDownloader.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/code-snippets", codeSnippetsRoutes);
app.use("/yt-downloader", ytDownloaderRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING!");
});

const PORT = process.env.PORT || 3426;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT} 🔥🔥🔥`)))
  .catch((err) => console.error(err.message));
