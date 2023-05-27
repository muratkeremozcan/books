const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();
const EventBridge = require("aws-sdk/clients/eventbridge");
const EventBridgeClient = new EventBridge();

const { CARTS_TABLE, EVENT_BUS_NAME } = process.env;

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const userId = event.pathParameters["userId"];
  const getResp = await DocumentClient.get({
    TableName: CARTS_TABLE,
    Key: {
      userId,
    },
  }).promise();

  const cart = getResp.Item || { userId, items: [] };
  const newItem = JSON.parse(event.body);
  cart.items.push(newItem);

  await DocumentClient.put({
    TableName: CARTS_TABLE,
    Item: cart,
  }).promise();

  await EventBridgeClient.putEvents({
    Entries: [
      {
        EventBusName: EVENT_BUS_NAME,
        Source: "chapter01-lesson03",
        DetailType: "item-added-to-cart",
        Detail: JSON.stringify({
          userId,
          newItem,
        }),
      },
    ],
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  };
};
