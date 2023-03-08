const db = require("../../../../models");
const { generateV4ReadSignedUrl } = require("../../../shared/googleCloudStore");

const getDBProductsService = async ({ query }) => {
  const { categoryId } = query;

  let catInclude = {
    model: db.Category,
    as: "cat",
    required: false,
    where: {},
  };

  if (categoryId) {
    catInclude.where["id"] = categoryId;
    catInclude.required = true;
  }

  const dbProducts = await db.Product.findAll({
    include: [
      {
        model: db.ProductMedia,
        as: "medias",
        required: true,
      },
      catInclude,
    ],
  });

  let products = await Promise.all(
    dbProducts.map(async (p) => {
      p.dataValues.medias = await Promise.all(
        p.dataValues.medias.map(async (media) => {
          media.dataValues.url = await generateV4ReadSignedUrl(media.name);
          return media;
        })
      );
      return p;
    })
  );

  return {
    data: products,
    message: "Success",
  };
};

module.exports = getDBProductsService;
