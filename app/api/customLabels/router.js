const router = require("express-promise-router")();
const { validator } = require("../../../app/middleware/validatior");

const {
  createCategorySchema,
  deleteCategorySchema,
  updateProductSchema,
} = require("./schema");
const {
  searchForLabelController,
  addProductsToGoogleCloudController,
  searchFromProductByImageGoogleCloudController,
  getDBProductsController,
  createCategoryController,
  readCategoryController,
  deleteCategoryController,
  updateProductController,
  deleteProductController,
} = require("./controller");

const routes = {
  baseRoute: "/custom-label",
  root: "/",
  search: "/search",
  products: "/products",
  category: "/category",
};

router.post(routes.root, addProductsToGoogleCloudController);
router.post(routes.search, searchForLabelController);
router.post("/search-image", searchFromProductByImageGoogleCloudController);
router.get(routes.products, getDBProductsController);

router.post(
  routes.products,
  validator(updateProductSchema),
  updateProductController
);

//Category
router.get(routes.category, validator({}), readCategoryController);
router.delete(
  routes.category,
  validator(deleteCategorySchema),
  deleteCategoryController
);

router.post(
  routes.category,
  validator(createCategorySchema),
  createCategoryController
);
router.delete(
  routes.products,
  validator(deleteCategorySchema),
  deleteProductController
);
module.exports = {
  customLabelRoute: routes.baseRoute,
  customLabelRouter: router,
};
