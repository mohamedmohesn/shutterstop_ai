require("dotenv").config();
let AWS = require("aws-sdk");
const config = require(".");
const { v5: uuidv5 } = require("uuid");

const rekognition = {
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsAccessKey,
  region: config.awsRegion,
  apiVersions: {
    rekognition: "2016-06-27",
  },
};

const s3 = new AWS.S3({
  region: config.awsRegion,
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsAccessKey,
  Bucket: config.awsBucket,
  bucket: config.awsBucket,
  signatureVersion: "v4",
  logger: console,
  httpOptions: {
    connectTimeout: 2 * 5000, // time succeed in starting the call
    timeout: 2 * 5000, // time to wait for a response
  },
});

async function uploadToS3(file, ext) {
  try {
    const hashedFileName = uuidv5(`${file}${Date.now()}`, uuidv5.URL);
    const params = {
      Bucket: config.awsBucket,
      bucket: config.awsBucket,
      Body: file,
      ACL: "public-read",
      Key: `${hashedFileName}.${ext}`,
    };

    const { Location } = await s3.upload(params).promise();
    console.log(Location);
    return {
      link: Location,
      key: `${hashedFileName}.${ext}`,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Unable to upload image",
    };
  }
}

async function getSignedUrl(photoName) {
  let params = {
    Bucket: config.awsBucket,
    Key: photoName,
  };
  let url = s3.getSignedUrl("getObject", params);
  console.log(url);
  return url;
}

const Recognition = new AWS.Rekognition(rekognition);

module.exports = {
  awsRekognition: Recognition,
  uploadToS3,
  getSignedUrl,
};
