const {
    searchForFacesByImage
} = require("../../../shared/awsRekognition")


const {
    getSignedUrl,
    uploadToS3
} = require("../../../config/aws");
const config = require("../../../config");


module.exports =async ({
    files
}) => {
    try {
        if (!files) return {error:"Please upload images",status:400}
        if (!files.length) return {error:"Please upload images",status:400}
    
        const file = files[0]
        const [, fileExt] = file.mimetype.split("/");
        const fileTOS3 = await uploadToS3(file.buffer, fileExt);
        const photoName = fileTOS3.key
console.log('2',photoName);
        const Image = {
            S3Object: {
                Bucket: config.awsBucket,
                Name: photoName,
            }
        }
        const {
            error,
            detection,
            facesFromDb
        } = await searchForFacesByImage(Image)
        if (error) {
            console.log(error)
            return {
                error: 'Something went wrong while image processing',
                status: 400
            }
        }
        const photos = await Promise.all(
            facesFromDb.map(async face => {
                const photoName = face.photoName
                return await getSignedUrl(photoName);
            })
        )
        return {
            message: "Image has been proccessed",
            data: {
                detection,
                photos,
                facesFromDb
            },
        }
    } catch (error) {
        console.log(error)
        return {
            error: "Please provide me with IMAGE URL",
            status: 400
        }
    }

}