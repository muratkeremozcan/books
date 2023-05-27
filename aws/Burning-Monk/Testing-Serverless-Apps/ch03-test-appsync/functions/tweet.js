const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const ulid = require('ulid')

const { TWEETS_TABLE } = process.env

module.exports.handler = async (event) => {
  const { text } = event.arguments
  const { username } = event.identity
  const id = ulid.ulid()
  const timestamp = new Date().toJSON()

  const newTweet = {
    id,
    text,
    creator: username,
    createdAt: timestamp,
  }

  await DocumentClient.put({
    TableName: TWEETS_TABLE,
    Item: newTweet
  }).promise()

  return newTweet
}