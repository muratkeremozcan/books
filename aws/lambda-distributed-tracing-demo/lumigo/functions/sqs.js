const AWS = require('aws-sdk')
const SNS = new AWS.SNS()

const TopicArn = process.env.TOPIC_ARN

module.exports.handler = async (event) => {
  await SNS.publish({
    TopicArn,
    Message: event.Records[0].body
  }).promise()
}