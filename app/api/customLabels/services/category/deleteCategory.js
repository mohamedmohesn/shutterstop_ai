const db = require("../../../../../models");

const deleteCategoryService = async ({ query }) => {
  const { id } = query;
  const category = await db.Category.findByPk(id);

  if (!category) {
    return {
      error: "Invalid category id",
      status: 400,
    };
  }
  await category.update({ deletedAt: new Date() });

  return {
    data: category,
    message: "Category has been deleted",
  };
};

module.exports = deleteCategoryService;
