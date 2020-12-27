"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});
const bucketName = process.env.S3_BUCKET || 'jlat-test';
const imgUpload = (file) => {
    const { originalname, fileType, folder = 'inventory' } = file;
    const s3Params = {
        Bucket: bucketName,
        Key: originalname,
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
            url: `https://${bucketName}.s3.amazonaws.com/${folder}/${originalname}`,
        };
        console.log('resolved');
        return JSON.stringify(returnData);
    });
};
exports.imgUpload = imgUpload;
exports.default = exports.imgUpload;
