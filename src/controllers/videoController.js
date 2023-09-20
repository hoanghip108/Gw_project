import { getLesson } from '../services/lessonServices.js';
const request = require('request');
const videoPlayer = async (req, res, next) => {
  const lessonId = req.params.id;
  const lesson = await getLesson(lessonId);
  const videoUrl = lesson.videoPath;
  return request.get(videoUrl).pipe(res);
};
export { videoPlayer };
