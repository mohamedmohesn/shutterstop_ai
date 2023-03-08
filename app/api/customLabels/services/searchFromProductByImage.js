const { getSimilarProductsGcs } = require("../../../shared/googleVision");
const { googleLocation, googleProjectId } = require("../../../config");
const db = require("../../../../models");
const { generateV4ReadSignedUrl } = require("../../../shared/googleCloudStore");
const { Op } = require("sequelize");
module.exports = async ({ body, files }) => {
  const { category, categoryId } = body;
  if (!files)
    return {
      error: "Please upload images",
      status: 400,
    };
  if (!files.length)
    return {
      error: "Please upload images",
      status: 400,
    };

  const file = files[0];

  const image = file.buffer;
  const { results, error } = await getSimilarProductsGcs(category, image, "");
  if (error)
    return {
      error,
      status: 500,
    };
  const { results: productResults } = results;

  let productIds = await Promise.all(
    productResults.map(async (result) => {
      const { product: productFromGC } = result;
      let split = `projects/${googleProjectId}/locations/${googleLocation}/products/`;
      const productId = productFromGC.name.replace(split, "");
      return productId;
    })
  );

  let innerInclude = [
    {
      model: db.ProductMedia,
      as: "medias",
      required: true,
    },
    {
      model: db.Category,
      as: "cat",
      required: false,
    },
  ];

  if (categoryId) {
    innerInclude[1] = {
      model: db.Category,
      as: "cat",
      where: { id: categoryId },
      required: true,
    };
  }

  let products = await db.Product.findAll({
    where: {
      [Op.or]: [
        {
          uuid: productIds,
        },
      ],
    },
    include: innerInclude,
  });

  products = await Promise.all(
    products.map(async (p) => {
      p.dataValues.medias = await Promise.all(
        p.dataValues.medias.map(async (media) => {
          media.dataValues.url = await generateV4ReadSignedUrl(media.name);
          return media;
        })
      );

      p.dataValues.score = productResults.find(
        ({ product }) =>
          product.name.replace(
            `projects/${googleProjectId}/locations/${googleLocation}/products/`,
            ""
          ) == p.dataValues.uuid
      );
      return p;
    })
  );

  if (body.score) {
    const score = body.score;
    products = await products.filter((p) => {
      return p.dataValues.score.score > parseFloat(score);
    });
  }

  return {
    data: products,
    message: "Success",
  };
};
