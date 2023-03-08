require('dotenv').config()

module.exports = {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKET_NAME,
    awsARNVersion: process.env.AWS_ARN_VERSION,
    port: process.env.PORT || 5000,
    googleAPIKey: process.env.GOOGLE_API_KEY,
    googleProjectId: process.env.GOOGLE_PROJECT_ID,
    googleLocation: 'europe-west1',
    googelBucket: "shutterstop"
}