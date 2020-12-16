require('./config/config')
import express = require('express')
import mongoose = require('mongoose')
import cors = require('cors')
import path = require('path')

const app: express.Application = express()
import bodyParser from 'body-parser'
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, './public')))
app.use(require('./routes/products'))

const urlDB: any = process.env.URLDB

// db connection
mongoose.connect(
  urlDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) { throw err }
    console.log('connected to database')
  }
)

app.listen(process.env.PORT, () => {
  console.log(`escuchando puerto: ${process.env.PORT}`)
})
