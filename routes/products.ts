import express from 'express'
const app = express()
import _ from 'underscore'
const Product = require('../models/product')

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

module.exports = app
