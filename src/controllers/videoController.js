const fs = require('fs');
import c from 'config';
import { getLesson } from '../services/lessonServices.js';
const videoPlayer = async (req, res, next) => {
  const lessonId = req.params.id;
  const lesson = await getLesson(lessonId);
  console.log(lesson.videoPath);
  const videoPath = lesson.videoPath;

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    const headers = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, headers);
    fs.createReadStream(videoPath).pipe(res);
  }
};
export { videoPlayer };
