const db = require("../../../../../models");

const createCategoryService = async ({ body }) => {
  const { name } = body;

  const category = await db.Category.create({
    name,
  });

  return {
    data: category,
    message: "Category has been added",
  };
};

module.exports = createCategoryService;
