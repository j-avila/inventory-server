"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
// module.exports = mongoose.model('Product', productSchema)
