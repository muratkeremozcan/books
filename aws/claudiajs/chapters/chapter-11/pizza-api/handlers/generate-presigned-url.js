'use strict'

const uuidv4 = require('uuid/v4')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

function generatePresignedUrl() {
  const params = {
    Bucket: process.env.bucketName,
    Key: uuidv4(),
    ACL: 'public-read',
    Expires: 120
  }

  s3.getSignedUrl('putObject', params).promise()
    .then(url => {
      return {
        url: url
      }
    })
}

module.exports = generatePresignedUrl
