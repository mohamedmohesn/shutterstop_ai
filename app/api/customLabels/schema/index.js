const Joi = require("joi");

exports.createCategorySchema = {
  name: Joi.string().required().max(500),
};

exports.deleteCategorySchema = {
  id: Joi.number().positive().integer().required(),
};

exports.updateProductSchema = {
  productId: Joi.number().positive().integer().required(),
  categoryId: Joi.number().integer().optional(),
  name: Joi.string().optional().max(500),
};
