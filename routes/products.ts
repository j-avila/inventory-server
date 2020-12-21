import express from 'express'
const app = express()
import _ from 'underscore'
import { IProduct } from '../models/product'
import Product from '../models/product'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
})

export const imgUpload = (file: any, folder: string) => {
  console.log(file, folder)
  const s3bucket = 'jlat-test'
  const { fileName, fileType } = file
  const s3Params = {
    Bucket: `${s3bucket}/${folder}`,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read',
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
    }

    const returnData = {
      signedRequest: data,
      url: `https://${s3bucket}.s3.amazonaws.com/${folder}/${fileName}`,
    }
    console.log(returnData)
    return returnData
  })
}

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

app.post('/products', async (req: any, res: any) => {
  let body: any = req.body

  const product: IProduct = new Product({
    sku: body.sku,
    name: body.name,
    aviable: body.aviable,
    uniPrice: body.uniPrice,
    brand: body.brand,
    image: body.image,
    description: body.description,
    category: body.category,
  })

  product.save((err: any, dbRes: any) => {

    const productImg = imgUpload(req.body.image, 'inventory')

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

    res.json({
      ok: true,
      product: { ...dbRes, image: productImg }
    })
  })


})

module.exports = app
