const http = require("http")
const app = require("./app")
const {
    port
} = require("./app/config")
const server = http.createServer(app)
require('./models')


server.listen(port, () => {
    console.log('NodeJS Application is up and running on PORT=', 5000)
})

