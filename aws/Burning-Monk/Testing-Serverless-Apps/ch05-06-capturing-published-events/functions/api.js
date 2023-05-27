const EventBridge = require('aws-sdk/clients/eventbridge')
const EventBridgeClient = new EventBridge()
const uuid = require('uuid')

const { EVENT_BUS } = process.env

/**
 * 
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  await EventBridgeClient.putEvents({
    Entries: [{
      EventBusName: EVENT_BUS,
      Source: 'api-function',
      DetailType: 'greeting',
      Detail: JSON.stringify({
        id: uuid.v4(),
        message: `api function says hello`
      })
    }]
  }).promise()

  return {
    statusCode: 202
  }
}
