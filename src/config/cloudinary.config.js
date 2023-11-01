const cloudinary = require('cloudinary').v2;
const process = require('process');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY
});


// Upload

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "profiles",
    },
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    }
  });
  
  const uploadCloud = multer({
      storage: storage,
      limits: { fileSize: '1000000' }, });
  
  module.exports = uploadCloud;