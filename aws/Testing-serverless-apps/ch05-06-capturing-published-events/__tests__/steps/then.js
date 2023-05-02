const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const a_row_does_not_exist_in_dynamodb = async (id) => {
  const getResp = await DocumentClient.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    }
  }).promise()

  expect(getResp.Item).not.toBeTruthy()
}

const a_row_exists_in_dynamodb = async (id) => {
  const getResp = await DocumentClient.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    }
  }).promise()

  expect(getResp.Item).toBeTruthy()

  return getResp.Item
}

module.exports = {
  a_row_does_not_exist_in_dynamodb,
  a_row_exists_in_dynamodb
}
