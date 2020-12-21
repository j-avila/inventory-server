import mongoose from 'mongoose'
const Schema = mongoose.Schema

export interface IProduct extends mongoose.Document {
  name: string
  uniPrice: number
  sku: number
  brand: string
  description: string
  image: string
  avaiable: boolean
}

const productSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es necesario'] },
  uniPrice: {
    type: Number,
    required: [true, 'El precio únitario es necesario'],
  },
  sku: { type: Number, require: true },
  brand: { type: String, require: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  aviable: { type: Boolean, required: true, default: true },
})

const Product = mongoose.model<IProduct>('Product', productSchema)
export default Product

// module.exports = mongoose.model('Product', productSchema)
