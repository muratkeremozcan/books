const AWS = require('aws-sdk')
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const StepFunctions = new AWS.StepFunctions()
const { ExecutionFailedError } = require('../lib/errors')
const messages = require('../lib/messages')

const an_order_exists_in_dynamodb = async (orderId) => {
  const getResp = await DocumentClient.get({
    TableName: process.env.OrdersTableName,
    Key: {
      id: orderId
    }
  }).promise()

  expect(getResp.Item).not.toBeNull()

  return getResp.Item
}

const a_restaurant_notification_is_received = async (orderId) => {
  const match = await messages.waitForMessage(
    process.env.RestaurantNotificationTopicArn,
    { OrderId: orderId }
  )

  return JSON.parse(match.message)
}

const a_user_notification_is_received = async (orderId) => {
  const match = await messages.waitForMessage(
    process.env.UserNotificationTopicArn,
    { OrderId: orderId }
  )

  return JSON.parse(match.message)
}

const execution_output_is = async (executionArn, expectation) => {
  const resp = await StepFunctions.describeExecution({
    executionArn
  }).promise()

  if (resp.status === 'FAILED') {
    throw new ExecutionFailedError(executionArn)
  }

  expect(resp.output).toEqual(expectation)

  return resp.output
}

const execution_status_is = async (executionArn, expectation) => {
  const resp = await StepFunctions.describeExecution({
    executionArn
  }).promise()

  expect(resp.status).toEqual(expectation)
}

module.exports = {
  an_order_exists_in_dynamodb,
  a_restaurant_notification_is_received,
  a_user_notification_is_received,
  execution_output_is,
  execution_status_is,
}