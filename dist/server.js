"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('./config/config');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const body_parser_1 = __importDefault(require("body-parser"));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(cors());
app.use(body_parser_1.default.json());
app.use(express.static(path.resolve(__dirname, './public')));
app.use(require('./routes/products'));
const urlDB = process.env.URLDB;
// db connection
mongoose.connect(urlDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        throw err;
    }
    console.log('connected to database');
});
app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto: ${process.env.PORT}`);
});
