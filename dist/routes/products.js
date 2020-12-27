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
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const product_1 = __importDefault(require("../models/product"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});
const upload = multer_1.default();
const bucketName = process.env.S3_BUCKET || 'jlat-test';
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// routes
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
app.post('/products', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let image = req.file;
    console.log('init', image);
    const product = new product_1.default({
        sku: body.sku,
        name: body.name,
        aviable: body.aviable,
        uniPrice: body.uniPrice,
        brand: body.brand,
        image: '',
        description: body.description,
        category: body.category,
    });
    const s3Params = {
        Bucket: bucketName,
        Key: image.originalname,
        Expires: 500,
        ContentType: image.fileType,
        ACL: 'public-read',
        Body: image.buffer
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${bucketName}.s3.amazonaws.com/inventory/${image.originalname}`,
        };
        product.save((err, dbRes) => __awaiter(void 0, void 0, void 0, function* () {
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
            let { id, aviable, sku, name, uniPrice, brand, image, description } = dbRes;
            res.json({
                ok: true,
                product: { id, aviable, sku, name, uniPrice, brand, description, image: returnData.url }
            });
        }));
    });
}));
module.exports = app;
