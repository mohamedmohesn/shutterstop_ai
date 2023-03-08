const {
    v4
} = require("uuid");
const {
    awsRekognition,
    uploadToS3,
    getSignedUrl
} = require("../config/aws");
const {
    logger
} = require("../config/logger");
const rekognitionCollections = {
    facesCollection: 'shutterFaces'
}

const {
    Face
} = require("../../models");
const config = require("../config/index");
const createCollections = async () => {
    const facesCollection = rekognitionCollections.facesCollection
    var params = {
        CollectionId: facesCollection,
    };
    awsRekognition.createCollection(params, function (err, data) {
        if (err) {
            if (err.message && err.message.includes('already exists')) {
                logger.info(facesCollection + " collection exists")
            }
        } else logger.info(facesCollection + " has been created")
    });

}
createCollections()



const proccessImage = async (imageData) => {
    let params = {
        Image: {
            Bytes: imageData
        },
        Attributes: ['ALL']
    };

    try {
        const detection = await awsRekognition.detectFaces(params).promise()
        return {
            detection
        }
    } catch (error) {
        return {
            error
        }

    }


}

const indexFaces = async (photoName) => {
    var params = {
        CollectionId: rekognitionCollections.facesCollection,
        DetectionAttributes: [],
        ExternalImageId: photoName,
        Image: {
            S3Object: {
                Bucket: config.awsBucket,
                Name: photoName,
            }
        }
    };
    try {
        const detection = await awsRekognition.indexFaces(params).promise()
        let facesToDB = await Promise.all(
            detection.FaceRecords.map(async (
                face
            ) => {
                return await Face.create({
                    imageId: face.Face.ImageId,
                    faceId: face.Face.FaceId,
                    photoName: photoName,
                    responseData: JSON.stringify(face),
                })
            })
        )

        return {
            facesToDB,
            detection
        }
    } catch (error) {
        console.error(error)
        return {
            error
        }
    }
}

const uploadThenIndexFaces = async (images) => {
    return await Promise.all(
        images.map(async file => {
            const [, fileExt] = file.mimetype.split("/");
            const fileTOS3 = await uploadToS3(file.buffer, fileExt);
            const photoName = fileTOS3.key
            if (fileTOS3.key) return await indexFaces(photoName)


        })
    )
}


const searchForFacesByImage = async (image) => {
    var params = {
        CollectionId: rekognitionCollections.facesCollection,
        FaceMatchThreshold: 90,
        Image: image,
        MaxFaces: 5
    };

    try {
        const detection = await awsRekognition.searchFacesByImage(params).promise()
        let facesIds = await detection.FaceMatches.map(match => match.Face.FaceId)
        console.log('faceIds', facesIds)
        const facesFromDb = await Face.findAll({
            where: {
                faceId: facesIds
            }
        })
        console.log(detection.FaceMatches)
        console.log(facesFromDb)
        await Promise.all(
            await detection.FaceMatches.map(async match => {
                const id = await facesFromDb.find(f => f.dataValues.faceId == match.Face.FaceId)
                if (id) {
                    match.image = await getSignedUrl(id.photoName)
                }
                return match
            })

        )
        return {
            facesFromDb,
            detection
        }
    } catch (error) {
        return {
            error
        }
    }


}


const detectCustomLabel = async (Image) => {
    const detectionParams = {
        Image,
        ProjectVersionArn:config.awsARNVersion,
    }
    const startParams = {
        ProjectVersionArn:config.awsARNVersion,
        MinInferenceUnits:1
    }
    const stopParams = {
        ProjectVersionArn:config.awsARNVersion,
    }

   try {
   // await awsRekognition.startProjectVersion(startParams).promise()
    const detection = await awsRekognition.detectCustomLabels(detectionParams).promise()
 //   await awsRekognition.stopProjectVersion(stopParams).promise()
    return {detection}
   } catch (error) {
        console.log(error)
        return {error:error.message}   
   }
}

module.exports = {
    proccessImage,
    uploadThenIndexFaces,
    searchForFacesByImage,
    detectCustomLabel
}