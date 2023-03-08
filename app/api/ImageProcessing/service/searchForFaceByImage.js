const { searchForFacesByImage } = require("../../../shared/awsRekognition");
const axios = require("axios");
const { getSignedUrl } = require("../../../config/aws");

module.exports = async ({ body, query }) => {
  let imageURL;
  if (body && body.imageURL) {
    imageURL = body.imageURL;
  }

  if (query && query.imageURL) {
    imageURL = query.imageURL;
  }
  console.log("img", body);
  try {
    const response = await axios({
      method: "GET",
      url: imageURL,
      responseType: "arraybuffer",
    });

    let Image = {
      Bytes: response.data,
    };
    const { error, detection, facesFromDb } = await searchForFacesByImage(
      Image
    );
    if (error) {
      console.log(error);
      return {
        error: "Something went wrong while image processing",
        status: 400,
      };
    }
    const photos = await Promise.all(
      facesFromDb.map(async (face) => {
        const photoName = face.photoName;
        return await getSignedUrl(photoName);
      })
    );
    return {
      message: "Image has been proccessed",
      data: {
        detection,
        photos,
        facesFromDb,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Please provide me with IMAGE URL",
      status: 400,
    };
  }
};
