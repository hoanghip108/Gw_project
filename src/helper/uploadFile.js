const streamifier = require('streamifier');
const APIError = require('./apiError');
import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name: 'dj6sdj5yq',
  api_key: '371489392313257',
  api_secret: 'fQRiqtcdpqtpED26cMR3eOdxi8c',
});

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer || !(file.buffer instanceof Buffer)) {
      reject(new APIError({ message: 'Invalid file object' }));
      return;
    }

    const img_stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'avatar',
        public_id: `${Date.now()}`,
      },
      function (err, result) {
        if (err) {
          reject(new APIError({ message: 'Upload image failed', errors: err }));
        } else {
          resolve(result.url);
        }
      },
    );
    streamifier.createReadStream(file.buffer).pipe(img_stream);
  });
};

export { uploadImage };
