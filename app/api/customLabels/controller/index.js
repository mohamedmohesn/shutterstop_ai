const { controller } = require("../../../middleware/controller");
const {
  searchForLabelService,
  addProductsToGoogleCloud,
  searchFromProductByImage,
  getDBProductsService,
  createCategoryService,
  readCategoryService,
  deleteCategoryService,
  updateProductService,
  deleteProductService,
} = require("../services");

module.exports = {
  searchForLabelController: controller(searchForLabelService),
  addProductsToGoogleCloudController: controller(addProductsToGoogleCloud),
  searchFromProductByImageGoogleCloudController: controller(
    searchFromProductByImage
  ),
  getDBProductsController: controller(getDBProductsService),
  ///Category
  createCategoryController: controller(createCategoryService),
  readCategoryController: controller(readCategoryService),
  deleteCategoryController: controller(deleteCategoryService),
  updateProductController: controller(updateProductService),
  deleteProductController: controller(deleteProductService),
};
