const redis = require('../redis/index.js');
const incrementViewCount = async (videoId, watchDurationInSeconds) => {
  const currentTime = Date.now();
  const [previousTimestamp, previousViewCount] = await redis.hmget(
    `video:${videoId}`,
    'timestamp',
    'view_count',
  );
  console.log('previousTimestamp', previousTimestamp);
  console.log('previousViewCount', previousViewCount);
  const timeDifferenceInSeconds = (currentTime - parseInt(previousTimestamp)) / 1000;
  if (timeDifferenceInSeconds >= watchDurationInSeconds) {
    console.log(timeDifferenceInSeconds >= watchDurationInSeconds);
    // Increment the view count
    const newViewCount = parseInt(previousViewCount) + 1;
    await redis.hmset(`video:${videoId}`, 'timestamp', currentTime, 'view_count', newViewCount);
  }
  //   await redis.incr(`video:${videoId}:views`);
  console.log(await redis.get(`video:${videoId}:views`));
  //   console.log(viewCount ? parseInt(viewCount) : 0);
};
export { incrementViewCount };
