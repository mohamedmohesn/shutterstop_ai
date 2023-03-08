const router = require("express-promise-router")();
const { validator } = require("../../../app/middleware/validatior");
const { detectImageSchema } = require("./schema");
const {
  detectImageController,
  insertFacesController,
  searchForFaceByImageController,
  searchForFaceByUploadController,
  detectImageServiceByUploadController,
  filterPhotoController,
} = require("./controller");

const routes = {
  baseRoute: "/image",
  root: "/",
  face: "/face",
  faceByUpload: "/face/face-by-upload",
  photoByUpload: "/face-by-upload",
  filter: "/filter",
};

router.post(routes.root, validator(detectImageSchema), detectImageController);
router.get(routes.root, validator(detectImageSchema), detectImageController);

router.post(routes.face, insertFacesController);
router.get(
  routes.face,
  validator(detectImageSchema),
  searchForFaceByImageController
);

router.post(routes.faceByUpload, searchForFaceByUploadController);
router.post(routes.photoByUpload, detectImageServiceByUploadController);
router.post(routes.filter, filterPhotoController);
module.exports = {
  imageRoute: routes.baseRoute,
  imageRouter: router,
};
