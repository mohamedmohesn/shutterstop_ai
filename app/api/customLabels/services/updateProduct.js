const { Product, ProductCategory, Category } = require("../../../../models");

const updateProductService = async ({ body }) => {
  const { productId, categoryId, name } = body;
  if (!productId) {
    return {
      error: "Product id is required",
      status: 400,
    };
  }
  const product = await Product.findByPk(productId);
  if (!product) {
    return {
      error: "Valid Product id is required",
      status: 400,
    };
  }
  let category;
  if (categoryId) {
    const productCategory = await ProductCategory.findOne({
      where: { productId },
    });

    if (categoryId == 0) {
      if (productCategory) {
        await ProductCategory.destroy({
          where: {
            productId,
          },
        });
      }
    } else {
      category = await Category.findByPk(categoryId);
      if (!category) {
        return {
          error: "Valid category id is required",
          status: 400,
        };
      }
      if (productCategory) {
        await productCategory.update({ categoryId });
      } else {
        await ProductCategory.create({
          productId,
          categoryId,
        });
      }
    }
  }

  if (name) {
    await product.update({ displayName: name });
  }

  return {
    data: { product, category },
    message: "Product has been updated",
  };
};

module.exports = updateProductService;
