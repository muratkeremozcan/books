const AWS = require('aws-sdk')
const SNS = new AWS.SNS()
const thundra = require("@thundra/core")()

const TopicArn = process.env.TOPIC_ARN

module.exports.handler = thundra(async (event) => {
  await SNS.publish({
    TopicArn,
    Message: event.Records[0].body
  }).promise()
})
