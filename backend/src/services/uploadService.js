const { uploadImage, deleteImage } = require('../config/cloudinary');

exports.uploadImage = async (filePath) => {
  return await uploadImage(filePath, 'benevolat/profiles');
};

exports.uploadMissionImage = async (filePath) => {
  return await uploadImage(filePath, 'benevolat/missions');
};

exports.deleteImage = async (publicId) => {
  return await deleteImage(publicId);
};

module.exports = exports;
