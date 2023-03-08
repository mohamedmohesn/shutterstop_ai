const db = require("../../../../../models");

const readCategoryService = async ({ query }) => {
  const { id } = query;
  const options = {
    where: {},
  };

  if (id) {
    options.where["id"] = id;
  }

  const cats = await db.Category.findAll(options);

  return {
    message: "Success",
    data: cats,
  };
};

module.exports = readCategoryService;
