require('dotenv').config()
require('isomorphic-fetch')
const gql = require('graphql-tag')
const { AWSAppSyncClient, AUTH_TYPE } = require('aws-appsync')

const appSyncConfig = (user) => ({
  url: process.env.ApiUrl,
  region: process.env.AwsRegion,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: () => `Bearer ${user.idToken}`
  },
  disableOffline: true
})

const initAppSyncClient = (user) => {
  const config = appSyncConfig(user)
  return new AWSAppSyncClient(config)
}

const a_user_calls_getMyTimeline = async (user, limit, nextToken) => {
  const client = initAppSyncClient(user)
  const resp = await client.query({
    query: gql`query getMyTimeline($limit: Int!, $nextToken: String) {
      getMyTimeline(limit: $limit, nextToken: $nextToken) {
        nextToken
        tweets {
          id
          createdAt
          text
        }
      }
    }`,
    variables: {
      limit,
      nextToken
    }
  })

  const timeline = resp.data.getMyTimeline

  console.log(`[${user.username}] - fetched timeline`)

  return timeline
}

const a_user_calls_tweet = async (user, text) => {
  const client = initAppSyncClient(user)
  const resp = await client.mutate({
    mutation: gql`mutation tweet($text: String!) {
      tweet(text: $text) {
        id
        createdAt
        text
      }
    }`,
    variables: {
      text
    }
  })

  const newTweet = resp.data.tweet

  console.log(`[${user.username}] - posted new tweet`)

  return newTweet
}

const a_user_calls_follow = async (user, userId) => {
  const client = initAppSyncClient(user)
  await client.mutate({
    mutation: gql`mutation follow($userId: ID!) {
      follow(userId: $userId)
    }`,
    variables: {
      userId
    }
  })

  console.log(`[${user.username}] - followed [${userId}]`)
}

module.exports = {
  a_user_calls_getMyTimeline,
  a_user_calls_tweet,
  a_user_calls_follow,
}