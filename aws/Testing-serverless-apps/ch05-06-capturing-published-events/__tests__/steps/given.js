const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const a_row_exists_in_dynamodb = async (id, source, message) => {
  await DocumentClient.put({
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id,
      source,
      message
    }
  }).promise()
}

module.exports = {
  a_row_exists_in_dynamodb
}
