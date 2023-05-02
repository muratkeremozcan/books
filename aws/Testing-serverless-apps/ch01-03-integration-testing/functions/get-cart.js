const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { CARTS_TABLE } = process.env;

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const getResp = await DocumentClient.get({
    TableName: CARTS_TABLE,
    Key: {
      userId: event.pathParameters["userId"],
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(getResp.Item || null),
  };
};
