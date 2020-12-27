import express from 'express'
const app = express()
import { IProduct } from '../models/product'
import Product from '../models/product'
import bodyParser from 'body-parser'
import multer from 'multer'
import AWS from 'aws-sdk'
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
})

const upload = multer()
const bucketName = process.env.S3_BUCKET || 'jlat-test'

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.get('/products', async (req: any, res: any) => {
  const terms = req.query.name
  const regex = new RegExp(terms, 'i')


  const queryString = {
    $and: [
      {
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { brand: regex },
        ],
      },
    ]
  }

  Product.find(queryString)
    .exec((err: any, product: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        product,
      })
    })
})

app.get('/products/sku', async (req: any, res: any) => {
  const idterm = Number(req.query.sku)
  const queryNumber = { sku: idterm }

  Product.find(queryNumber)
    .exec((err: any, product: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        product,
      })
    })
})

app.post('/products', upload.single('image'), async (req: any, res: any) => {
  let body: any = req.body
  let image = req.file

  console.log('init', image)

  const product: IProduct = new Product({
    sku: body.sku,
    name: body.name,
    aviable: body.aviable,
    uniPrice: body.uniPrice,
    brand: body.brand,
    image: '',
    description: body.description,
    category: body.category,
  })

  const s3Params = {
    Bucket: bucketName,
    Key: image.originalname,
    Expires: 500,
    ContentType: image.fileType,
    ACL: 'public-read',
    Body: image.buffer
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.end()
    }

    const returnData = {
      signedRequest: data,
      url: `https://${bucketName}.s3.amazonaws.com/inventory/${image.originalname}`,
    }

    product.save(async (err: any, dbRes: any) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if (!dbRes) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      let { id, aviable, sku, name, uniPrice, brand, image, description } = dbRes

      res.json({
        ok: true,
        product: { id, aviable, sku, name, uniPrice, brand, description, image: returnData.url }
      })
    })
  })

})

module.exports = app
