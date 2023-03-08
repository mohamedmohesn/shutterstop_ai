const googleFile = "app/config/copper-seeker-316710-9a49a390b74f.json"
const config = require('./index')
const vision = require('@google-cloud/vision');
const Cloud = require('@google-cloud/storage')

const client = new vision.ProductSearchClient({
    projectId: config.projectId,
    keyFilename: googleFile
});
const googleImageAnnotatorClient = new vision.ImageAnnotatorClient({
    projectId: config.projectId,
    keyFilename: googleFile
});

const {
    Storage
} = Cloud


const storage = new Storage({
    projectId: config.projectId,
    keyFilename: googleFile
})

module.exports = {
    googleVision: client,
    googleImageAnnotatorClient,
    googleStorage: storage
}