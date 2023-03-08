const { controller } = require("../../../middleware/controller");
const {
  detectImageService,
  insertFacesService,
  searchForFaceByImageService,
  searchForFacesByUploadService,
  detectImageServiceByUploadService,
  filterPhotoService,
} = require("../service");

module.exports = {
  detectImageController: controller(detectImageService),
  insertFacesController: controller(insertFacesService),
  searchForFaceByImageController: controller(searchForFaceByImageService),
  searchForFaceByUploadController: controller(searchForFacesByUploadService),
  detectImageServiceByUploadController: controller(
    detectImageServiceByUploadService
  ),
  filterPhotoController: controller(filterPhotoService),
};
