"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
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
});
module.exports = mongoose.model('Product', productSchema);
