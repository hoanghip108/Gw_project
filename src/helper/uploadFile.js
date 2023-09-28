require('dotenv').config();
const streamifier = require('streamifier');
const APIError = require('./apiError');
import cloudinary from 'cloudinary';
const { google } = require('googleapis');

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GG_CLIENT_ID,
  process.env.GG_CLIENT_SECRET,
  process.env.GG_REDIRECT_URL,
);
oauth2Client.setCredentials({ refresh_token: process.env.GG_REFRESH_TOKEN });
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
const uploadVideo = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const video_stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: folder,
        public_id: `${Date.now()}`,
      },
      function (err, result) {
        if (err) {
          reject(new APIError({ message: 'Upload video failed', errors: err.message }));
        } else {
          resolve(result.url);
        }
      },
    );
    streamifier.createReadStream(fileBuffer.buffer).pipe(video_stream);
  });
};
const setFilePublic = async (fileId) => {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const getUrl = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    return getUrl;
  } catch (error) {
    console.error(error);
  }
};
const uploadDocument = async (file) => {
  try {
    const createFile = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: streamifier.createReadStream(file.buffer),
      },
    });
    const fileId = createFile.data.id;
    console.log(createFile.data);
    const getUrl = await setFilePublic(fileId);
    console.log(getUrl.data);
  } catch (err) {
    console.log('this is error: ', err.message);
  }
};
export { uploadImage, uploadVideo, uploadDocument };
