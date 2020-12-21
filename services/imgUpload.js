import AWS from 'aws-sdk'
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
})

export const imgUpload = (file) => {
  const { fileName, fileType, folder } = file
  const s3Params = {
    Bucket: process.env.S3_BUKCET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read',
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
    }

    const returnData = {
      signedRequest: data,
      url: `https://${process.env.s3_BUBCKET}.s3.amazonaws.com/${fileName}`,
    }

    return returnData
  })
}
