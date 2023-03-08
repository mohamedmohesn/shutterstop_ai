const Joi = require('joi')


exports.detectImageSchema = {
    imageURL: Joi.string().uri().required()
}