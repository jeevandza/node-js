import express from "express";
import fs from "fs";
import cors from "cors";
// import { MyReadableStream} from './readable'

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (range) {
    res.status(400).send("Range is required");
    return;
  } else {
    const testVideo = "js.mp4";
    const videoSize = fs.statSync(testVideo).size;

    const start = Number(range?.replace(/\D+/g, "") || 0);
    const contentLength = end - start + 1;
    
    const end = Math.min(start + contentLength, videoSize - 1);
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "Video/mp4",
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(testVideo, { start, end });
    videoStream.pipe(res);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
