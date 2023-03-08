const router = require('express-promise-router')()
const { customLabelRoute, customLabelRouter } = require('./customLabels/router')
const {
    imageRouter,
    imageRoute
} = require("./ImageProcessing/router")


router.use(imageRoute, imageRouter)
router.use(customLabelRoute, customLabelRouter)

module.exports = router