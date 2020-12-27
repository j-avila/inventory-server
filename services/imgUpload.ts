import AWS from 'aws-sdk'
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
})

const bucketName = process.env.S3_BUCKET || 'jlat-test'

export const imgUpload = (file: any) => {
  const { originalname, fileType, folder = 'inventory' } = file
  const s3Params = {
    Bucket: bucketName,
    Key: originalname,
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
      url: `https://${bucketName}.s3.amazonaws.com/${folder}/${originalname}`,
    }
    console.log('resolved')
    return JSON.stringify(returnData);
  })
}

export default imgUpload
