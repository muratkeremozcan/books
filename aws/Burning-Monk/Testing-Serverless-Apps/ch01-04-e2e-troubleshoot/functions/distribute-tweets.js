const _ = require('lodash')
const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const Constants = require('../lib/constants')

const { RELATIONSHIPS_TABLE, TIMELINES_TABLE } = process.env

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === Constants.DynamoDB.STREAM_EVENT_NAMES.INSERT) {
      const tweet = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
      const followers = await getFollowers(tweet.creator)
      // add the tweet to the creator's timeline as well
      followers.push(tweet.creator)
      await distribute(tweet, followers)
    }
  }
}

async function getFollowers(userId) {
  const loop = async (acc, exclusiveStartKey) => {
    const resp = await DocumentClient.query({
      TableName: RELATIONSHIPS_TABLE,
      KeyConditionExpression: 'otherUserId = :otherUserId and begins_with(sk, :follows)',
      ExpressionAttributeValues: {
        ':otherUserId': userId,
        ':follows': 'FOLLOWS_'
      },
      IndexName: 'byOtherUser',
      ExclusiveStartKey: exclusiveStartKey
    }).promise()
  
    const userIds = (resp.Items || []).map(x => x.userId)

    if (resp.LastEvaluatedKey) {
      return await loop(acc.concat(userIds), resp.LastEvaluatedKey)
    } else {
      return acc.concat(userIds)
    }
  }

  return await loop([])
}

async function distribute(tweet, followers) {
  const timelineEntries = followers.map(userId => ({
    PutRequest: {
      Item: {
        userId,
        tweetId: tweet.id,
        timestamp: tweet.createdAt,
      }
    }
  }))

  const chunks = _.chunk(timelineEntries, Constants.DynamoDB.MAX_BATCH_SIZE)

  const promises = chunks.map(async chunk => {
    await DocumentClient.batchWrite({
      RequestItems: {
        [TIMELINES_TABLE]: chunk
      }
    }).promise()
  })

  await Promise.all(promises)
}
