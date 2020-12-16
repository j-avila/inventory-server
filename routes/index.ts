import express = require("express")
const app: express.Application = express()

app.use(require("./users"))
app.use(require("./login"))

module.exports = app
