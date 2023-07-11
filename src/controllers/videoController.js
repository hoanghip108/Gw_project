const fs = require('fs');
const videoFileMap = {
  'generate-pass': 'src/videos/Jujutsu-Kaisen-2nd-Season.mp4',
};

const videoPlayer = (req, res, next) => {
  const fileName = req.params.filename;
  const filePath = videoFileMap[fileName];
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
};

export { videoPlayer };
