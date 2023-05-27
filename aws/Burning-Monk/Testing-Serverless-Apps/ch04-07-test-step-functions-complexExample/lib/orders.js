const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const { ORDERS_TABLE } = process.env

const getOrder = async (orderId) => {
  const getReq = await DocumentClient.get({
    TableName: ORDERS_TABLE,
    Key: {
      id: orderId
    }
  }).promise()

  return getReq.Item
}

const setConfirmationToken = async (orderId, confirmationToken) => {
  await DocumentClient.update({
    TableName: ORDERS_TABLE,
    Key: {
      id: orderId
    },
    UpdateExpression: 'SET confirmationToken = :token',
    ExpressionAttributeValues: {
      ':token': confirmationToken
    }
  }).promise()
}

module.exports = {
  getOrder,
  setConfirmationToken
}
