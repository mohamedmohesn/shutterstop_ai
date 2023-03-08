const config = require('../../../config')
const {
    uploadToS3
} = require("../../../config/aws")
const {
    detectCustomLabel
} = require("../../../shared/awsRekognition")



module.exports = async ({
    files
}) => {
    try {
        if (!files) return {
            error: "Please upload images",
            status: 400
        }
        if (!files.length) return {
            error: "Please upload images",
            status: 400
        }
        const file = files[0]
        const [, fileExt] = file.mimetype.split("/");
        const fileTOS3 = await uploadToS3(file.buffer, fileExt);
        if (fileTOS3.message) {
            return {
                error: message,
                status: 400
            }
        }
        const photoName = fileTOS3.key

        const Image = {
            S3Object: {
                Bucket: config.awsBucket,
                Name: photoName,
            }
        }

        const {
            detection,
            error
        } = await detectCustomLabel(Image)
        if (error) {
            return {
                error,
                status: 400
            }
        }
        return {
            data: detection
        }

    } catch (error) {
        console.error(error)
        return {
            error: "Something went wrong",
            status: 500
        }
    }
}