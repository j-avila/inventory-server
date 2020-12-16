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
const Product = require('../models/product');
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
    Product.find(queryString)
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
    Product.find(queryNumber)
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
module.exports = app;
