"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use(require("./users"));
app.use(require("./login"));
module.exports = app;
