const addProductsToGoogleCloud = require("./addProductsToGoogleCloud");
const searchForLabelService = require("./searchForLabel");
const searchFromProductByImage = require("./searchFromProductByImage");
const getDBProductsService = require("./getDBProducts");
const createCategoryService = require("./category/addCategory");
const readCategoryService = require("./category/readCategory");
const deleteCategoryService = require("./category/deleteCategory");
const updateProductService = require("./updateProduct");
const deleteProductService = require("./deleteProduct");

module.exports = {
  searchForLabelService,
  addProductsToGoogleCloud,
  searchFromProductByImage,
  getDBProductsService,
  createCategoryService,
  readCategoryService,
  deleteCategoryService,
  updateProductService,
  deleteProductService,
};
