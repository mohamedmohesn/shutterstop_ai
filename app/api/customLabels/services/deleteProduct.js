const db = require("../../../../models");

const deleteProductService = async ({ query }) => {
  const { id } = query;
  const product = await db.Product.findByPk(id);

  if (!product) {
    return {
      error: "Invalid product id",
      status: 400,
    };
  }
  await db.ProductMedia.destroy({ where: { productId: id } });
  await db.ProductCategory.destroy({ where: { productId: id } });
  await product.destroy();

  return {
    data: product,
    message: "Product has been deleted",
  };
};

module.exports = deleteProductService;
