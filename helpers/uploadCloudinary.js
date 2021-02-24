const { CLOUDINARY_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = process.env
const Cloudinary = require('cloudinary').v2;

Cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY
});

module.exports = { Cloudinary }