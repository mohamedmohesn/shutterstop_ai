require("dotenv").config();
const {
    logger
} = require("./logger");

function logging(msg) {
    logger.info(msg);
}


const options = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    logging,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 20000,
    },
};

module.exports = {
    development: options,
    test: options,
    production: options,
};