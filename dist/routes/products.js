"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgUpload = void 0;
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const product_1 = __importDefault(require("../models/product"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});
const imgUpload = (file, folder) => {
    console.log(file, folder);
    const s3bucket = 'jlat-test';
    const { fileName, fileType } = file;
    const s3Params = {
        Bucket: `${s3bucket}/${folder}`,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read',
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
        }
        const returnData = {
            signedRequest: data,
            url: `https://${s3bucket}.s3.amazonaws.com/${folder}/${fileName}`,
        };
        console.log(returnData);
        return returnData;
    });
};
exports.imgUpload = imgUpload;
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const terms = req.query.name;
    const regex = new RegExp(terms, 'i');
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
    };
    product_1.default.find(queryString)
        .exec((err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            product,
        });
    });
}));
app.get('/products/sku', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idterm = Number(req.query.sku);
    const queryNumber = { sku: idterm };
    product_1.default.find(queryNumber)
        .exec((err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            product,
        });
    });
}));
app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const product = new product_1.default({
        sku: body.sku,
        name: body.name,
        aviable: body.aviable,
        uniPrice: body.uniPrice,
        brand: body.brand,
        image: body.image,
        description: body.description,
        category: body.category,
    });
    product.save((err, dbRes) => {
        const productImg = exports.imgUpload(req.body.image, 'inventory');
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!dbRes) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: Object.assign(Object.assign({}, dbRes), { image: productImg })
        });
    });
}));
module.exports = app;
