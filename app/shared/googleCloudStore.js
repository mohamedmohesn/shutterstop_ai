const {
    googleStorage
} = require("../config/google");

const {
    googelBucket
} = require("../config")

const bucket = googleStorage.bucket(googelBucket)

const uploadImageToGoogleCloud = async (file) => {
    try {
        return await new Promise((resolve, reject) => {
            const blob = bucket.file(new Date().toISOString().split('T')[0] + file.originalname)
            blob.createWriteStream({
                metadata: {
                    contentType: file?.mimetype
                },
                resumable: false //Good for small files
            }).on('finish', (response) => {
                const Url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve({
                    name: blob.name,
                    url: Url
                });
            }).on('error', err => {
                reject('upload error: ', err);
            }).end(file?.buffer);
        })
    } catch (error) {
        console.log(error)
        return error
    }
}

const generateV4ReadSignedUrl = async (fileName) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 30 * 60 * 1000, // 15 minutes
    };

    const [url] = await googleStorage
        .bucket(googelBucket)
        .file(fileName)
        .getSignedUrl(options);
    return url

}

module.exports = {
    uploadImageToGoogleCloud,
    generateV4ReadSignedUrl
}