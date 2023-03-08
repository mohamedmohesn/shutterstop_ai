const axios = require('axios')
const { uploadToS3 } = require('../../../config/aws')
const {
    proccessImage,

} = require("../../../shared/awsRekognition")


const AIAnalytics = async (data) => {

    const {
        FaceDetails
    } = data
    if (!FaceDetails) return
    if (!FaceDetails.length) return

    let personsCount = FaceDetails.length

    let persons = await Promise.all(
        await FaceDetails.map(
            async person => {
                let responseData = {}
                if (person.AgeRange) responseData.AgeRange = person.AgeRange
                if (person.Smile && person.Smile.Value) responseData.Smile = person.Smile.Value
                if (person.Gender && person.Gender) responseData.Gender = person.Gender.Value

                if (person.Emotions && person.Emotions.length) {
                    responseData.Emotions = await person.Emotions.filter(emotion => parseFloat(emotion.Confidence) > 50)
                }

                return responseData

            }
        )
    )

    return {
        persons,
        personsCount
    }

}

exports.detectImageService = async ({
    body,
    query
}) => {
    let imageURL;
    if (body && body.imageURL) {
        imageURL = body.imageURL
    }


    if (query && query.imageURL) {
        imageURL = query.imageURL
    }

    try {
        const response = await axios({
            method: "GET",
            url: imageURL,
            responseType: 'arraybuffer'
        })
        const {
            detection,
            error
        } = await proccessImage(response.data)


        if (error) {
            return {
                error: 'Something went wrong while image processing',
                status: 400
            }
        }
        const analytics = await AIAnalytics(detection)
        return {
            message: "Image has been proccessed",
            data: {
                analytics,
                detection
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


exports.detectImageServiceByUpload = async ({
  files
}) => {
    if (!files) return {error:"Please upload images",status:400}
    if (!files.length) return {error:"Please upload images",status:400}

    const file = files[0]
    const [, fileExt] = file.mimetype.split("/");
    const fileTOS3 = await uploadToS3(file.buffer, fileExt);
    const photoName = fileTOS3.link

    try {
        const response = await axios({
            method: "GET",
            url: photoName,
            responseType: 'arraybuffer'
        })
        const {
            detection,
            error
        } = await proccessImage(response.data)


        if (error) {
            return {
                error: 'Something went wrong while image processing',
                status: 400
            }
        }
        const analytics = await AIAnalytics(detection)
        return {
            message: "Image has been proccessed",
            data: {
                analytics,
                detection
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