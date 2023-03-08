const {
  detectImageService,
  detectImageServiceByUpload,
} = require("./detectImage");
const insertFacesService = require("./insertFacesService");
const filterPhotoService = require("./pho.to/filterPhoto");
const searchForFaceByImage = require("./searchForFaceByImage");
const searchForFacesByUpload = require("./searchForFacesByUpload");

module.exports = {
  detectImageService,
  insertFacesService,
  searchForFaceByImageService: searchForFaceByImage,
  searchForFacesByUploadService: searchForFacesByUpload,
  detectImageServiceByUploadService: detectImageServiceByUpload,
  filterPhotoService,
};
