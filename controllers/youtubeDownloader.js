import { google } from "googleapis";
import dotenv from "dotenv";
import ytdl from "ytdl-core";
import fs from "fs";

dotenv.config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

export const videoList = async (req, res) => {
  const query = req.query.q;

  // Call the search.list method to retrieve the list of videos
  const result = await youtube.search.list({
    part: "snippet",
    q: query,
    maxResults: 5,
    type: "video",
  });

  const videos = result.data.items;

  res.send(videos);
};

export const download = async (req, res) => {
  const videoId = req.query.vid;
  const format = req.query.format;

  // Get the video's metadata using the video.list method
  youtube.videos.list(
    {
      part: "snippet",
      id: videoId,
    },
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to retrieve video metadata");
      }

      const video = result.data.items[0];
      const title = video.snippet.title;

      // Set the appropriate content type based on the format
      // if (format === "mp3") {
      //   res.header("Content-Type", "audio/mpeg");
      //   res.header("Content-Disposition", `attachment; filename="file.mp3"`);
      // } else if (format === "mp4") {
      //   res.header("Content-Type", "video/mp4");
      //   res.header("Content-Disposition", `attachment; filename="file.mp4"`);
      // } else {
      //   return res.status(400).send("Invalid format specified");
      // }

      try {
        // console.log(videoId);
        // ytdl(`https://youtu.be/${videoId}`, { filter: "audioonly" }).pipe(fs.createWriteStream("haha.mp3"));
        // res.end();
        // Pipe the video's audio or video stream to the response
        const stream = ytdl(videoId, { quality: "highest" });
        stream.on("error", (err) => {
          console.error(err);
          res.status(500).send("Failed to download video");
        });
        console.log(stream.toString());
        stream.pipe(res);
        res.end();
      } catch (error) {
        console.error(error);
      }
    }
  );
};
