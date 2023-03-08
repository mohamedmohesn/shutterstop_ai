const { v4 } = require("uuid");
const {
  createProductInGoogleCloud,
  createReferenceImageGoogleCloud,
  addProductToSetGoogleCloud,
} = require("../../../shared/googleVision");
const { Product, ProductMedia } = require("../../../../models");
const {
  uploadImageToGoogleCloud,
} = require("../../../shared/googleCloudStore");
const db = require("../../../../models");

const afterResponseAdd = async ({ body, files }) => {
  if (!body.category) {
    body.category = "apparel";
  }
  console.log(files);
  const { name, category, categoryId } = body;

  if (categoryId && categoryId != "null" && categoryId != null) {
    let cat = await db.Category.findByPk(categoryId);
    if (!cat) {
      console.log("Returned without category");
      return {
        error: "Invalid category id",
        status: 400,
      };
    }
  }

  let productId = v4();
  let product = await Product.create({
    uuid: productId,
    displayName: name,
    category: category,
  });

  if (categoryId && categoryId != "null" && categoryId != null) {
    await db.ProductCategory.create({
      productId: product.id,
      categoryId,
    });
  }
  const images = await Promise.all(
    files.map(async (file) => {
      const fileUpload = await uploadImageToGoogleCloud(file);
      return fileUpload;
    })
  );

  const { createdProduct, error } = await createProductInGoogleCloud(
    name,
    category,
    productId
  );
  console.log("1",createdProduct);

  if (error)
    // console.log(error);
    return {
      error,
      status: 400,
    };
  await product.update({
    name: createdProduct.name,
  });
  const addImageToProduct = await Promise.all(
    images.map(async (image) => {
      const dbImage = await ProductMedia.create({
        productId: product.id,
        name: image.name,
      });
      const { response } = await createReferenceImageGoogleCloud(
        product.uuid,
        image.name,
        dbImage.id
      );
      console.log("2",response);
      if (response.name) {
        await dbImage.update({
          imageLocation: response.name,
        });
      }
      return response;
    })
  );
  await addProductToSetGoogleCloud(product.uuid);

  return {
    message: "Success",
    data: {
      createdProduct,
      addedImage: addImageToProduct,
    },
  };
};

module.exports = async ({ body, files }) => {
  if (!files || !files.length) {
    return {
      error: "Please Upload files",
      status: 400,
    };
  }
  if (body.type) {
    if (body.type == "multiple") {
      console.log("Uploading Multiple Products");
      await files.map((file) => {
        return afterResponseAdd({ files: [file], body });
      });

      return {
        message: "Product Uploading process is going on",
      };
    }
  }

  console.log("Uploading Single Products");

  afterResponseAdd({
    files,
    body,
  });

  return {
    message: "Product Uploading process is going on",
  };
};
