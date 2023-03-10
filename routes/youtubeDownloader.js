import express from "express";
import { videoList, download } from "../controllers/youtubeDownloader.js";

const router = express.Router();

router.get("/list", videoList);
router.get("/download", download);

export default router;
