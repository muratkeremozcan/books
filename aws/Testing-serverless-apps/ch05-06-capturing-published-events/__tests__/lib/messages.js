global.WebSocket = require('ws')
require('isomorphic-fetch')
const { ReplaySubject, firstValueFrom } = require("rxjs")
const { take, filter } = require("rxjs/operators")
const AWS = require('aws-sdk')
const gql = require('graphql-tag')
const { AWSAppSyncClient, AUTH_TYPE } = require('aws-appsync')

const client = new AWSAppSyncClient({
  url: process.env.EventCatcherUrl,
  region: process.env.AwsRegion,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials
  },
  disableOffline: true
})

const startListening = (target) => {
  console.log('listening to target:', target)

  const messages = new ReplaySubject(100)  
  const subscription = client.subscribe({
    query: gql `
      subscription onNewEvent ($accountId: ID!, $target: String!) {
        onNewEvent(accountId: $accountId, target: $target) {
          accountId
          eventId
          target
          payload
        }
      }
    `,
    variables: {
      accountId: process.env.AwsAccountId,
      target
    }
  }).subscribe({
    next: resp => {
      const newMessage = JSON.parse(resp.data.onNewEvent.payload)
      messages.next(newMessage)
    }
  })

  const stop = () => {
    console.log('stop listening to target:', target)
    subscription.unsubscribe()
  }

  const waitForMessage = (predicate) => {
    const data = messages.pipe(filter(x => predicate(x)))
    return firstValueFrom(data)
  }

  return {
    stop,
    waitForMessage,
  }
}

module.exports = {
  startListening
}
