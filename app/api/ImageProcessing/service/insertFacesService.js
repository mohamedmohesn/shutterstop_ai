const { uploadThenIndexFaces } = require("../../../shared/awsRekognition");
const faces = [];
const insertFacesService = async ({ files, protocol }, host) => {
  if (!files || files.length == 0) {
    return {
      error: "No image uplaoded",
      status: 400,
    };
  }
  files.map((file) => {
    const fullUrl = `${protocol}://${host}/${file.path}`;
    faces.push(fullUrl);
  });
  // const faces = await uploadThenIndexFaces(files)
  console.log({ files });

  return {
    message: "Images has beed added successfully",
    data: faces,
  };
};

module.exports = insertFacesService;
