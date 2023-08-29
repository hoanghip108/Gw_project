const fs = require('fs');
import { getLesson } from '../services/lessonServices.js';
const videoPlayer = async (req, res, next) => {
  const lessonId = req.params.id;
  const video = await getLesson(lessonId);
  console.log(video.videoPath);
  if (video) {
    const filePath = video.videoPath;
    if (!filePath) {
      return res.status(404).send('File not found');
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      return file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      return fs.createReadStream(filePath).pipe(res);
    }
  }
};

export { videoPlayer };
