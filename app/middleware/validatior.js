const Joi = require("joi");
const {
    logger
} = require("../../app/config/logger");

const validator = (schemaToValidate) => (req, res, next) => {
    const schema = Joi.object(schemaToValidate);
    const {
        query,
        body,
        method
    } = req;
    logger.info("query to validate >> ", query);
    logger.info("body to validate >> ", body);

    if (query) {
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                query[key] = query[key] ?
                    Array.isArray(query[key]) ?
                    query[key].map((q) => q.trim()) :
                    query[key].trim() :
                    "";
            }
        }
    }

    if (method == "DELETE" || method == "GET") {
        let {
            error
        } = schema.validate(query);

        if (error) {
            return res.status(403).json({
                error: {
                    type: "query validation",
                    key: error.details[0].context.key,
                    message: error.details[0].message,
                },
                status: 403,
            });
        } else {
            next();
        }
    } else if (method == "POST") {
        let {
            error
        } = schema.validate(body);

        if (error) {
            return res.status(403).json({
                error: {
                    type: "body validation",
                    key: error.details[0].context.key,
                    message: error.details[0].message,
                },
                status: 403,
            });
        }
        next();
    }
};

module.exports = {
    validator
};