const XRay = require('aws-xray-sdk-core')
const AWS = XRay.captureAWS(require('aws-sdk'))
const SNS = new AWS.SNS()

const TopicArn = process.env.TOPIC_ARN

module.exports.handler = async (event) => {
  await SNS.publish({
    TopicArn,
    Message: event.Records[0].body
  }).promise()
}