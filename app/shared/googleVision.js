const { v4 } = require("uuid");
const { googleProjectId, googleLocation } = require("../config");
const {
  googleVision,
  googleImageAnnotatorClient: imageAnnotatorClient,
} = require("../config/google");
const defaultSet = {
  name: "All",
  id: "123456789",
};

const createProduct = async (
  productDisplayName,
  productCategory,
  productId
) => {
  try {
    const locationPath = googleVision.locationPath(
      googleProjectId,
      googleLocation
    );
    const product = {
      displayName: productDisplayName,
      productCategory: productCategory,
    };

    const request = {
      parent: locationPath,
      product: product,
      productId,
    };

    const [createdProduct] = await googleVision.createProduct(request);
    console.log(`Product name: ${createdProduct.name}`);
    return {
      createdProduct,
    };
  } catch (error) {
    console.log("ErrorWhile Creating", error);
    return {
      error,
    };
  }
};

const addProductToSet = async (productId) => {
  const productPath = googleVision.productPath(
    googleProjectId,
    googleLocation,
    productId
  );
  const productSetPath = googleVision.productSetPath(
    googleProjectId,
    googleLocation,
    defaultSet.id
  );

  const request = {
    name: productSetPath,
    product: productPath,
  };

  await googleVision.addProductToProductSet(request);
  console.log("Product added to product set.");

  return googleVision;
};

const createReferenceImage = async (productId, gcsUri, referenceImageId) => {
  gcsUri = `gs://shutterstop/${gcsUri}`;
  const formattedParent = googleVision.productPath(
    googleProjectId,
    googleLocation,
    productId
  );

  const referenceImage = {
    uri: gcsUri,
  };

  const request = {
    parent: formattedParent,
    referenceImage: referenceImage,
    referenceImageId: referenceImageId,
  };

  const [response] = await googleVision.createReferenceImage(request);

  return {
    response,
  };
};

const getSimilarProductsGcs = async (
  productCategory = "apparel",
  imagePath,
  filter = ""
) => {
  try {
    const productSetPath = googleVision.productSetPath(
      googleProjectId,
      googleLocation,
      defaultSet.id
    );
    console.log(productSetPath);
    const request = {
      image: {
        content: imagePath,
      },
      features: [
        {
          type: "PRODUCT_SEARCH",
        },
      ],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    };

    const [response] = await imageAnnotatorClient.batchAnnotateImages({
      requests: [request],
    });
    const results = response["responses"][0]["productSearchResults"];
    const errors = response["responses"][0]["error"];
    console.log(request, results);
    console.log(errors)
    if (errors) {
      return {
        errors: {errors},
      };
    }
    return {
      results: results,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};

const createProductSet = async () => {
  try {
    const locationPath = googleVision.locationPath(
      googleProjectId,
      googleLocation
    );

    const productSet = {
      displayName: defaultSet.name,
    };

    const request = {
      parent: locationPath,
      productSet: productSet,
      productSetId: defaultSet.id,
    };

    const [createdProductSet] = await googleVision.createProductSet(request);
    console.log("Created Default Product Set");
  } catch (error) {
    console.log("Product Set exists");
  }
};
//createProductSet()
module.exports = {
  createProductInGoogleCloud: createProduct,
  createReferenceImageGoogleCloud: createReferenceImage,
  addProductToSetGoogleCloud: addProductToSet,
  getSimilarProductsGcs,
};
