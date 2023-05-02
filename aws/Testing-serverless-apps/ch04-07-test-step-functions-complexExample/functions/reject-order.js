const StepFunctions = require('aws-sdk/clients/stepfunctions')
const StepFunctionsClient = new StepFunctions()
const { getOrder } = require('../lib/orders')

/**
 * 
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const { orderId, token } = JSON.parse(event.body)

  const order = await getOrder(orderId)
  if (!order) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Order is not found.'
      })
    }
  }

  await StepFunctionsClient.sendTaskSuccess({
    taskToken: token,
    output: JSON.stringify({
      orderId: orderId,
      accepted: false
    })
  }).promise()

  return {
    statusCode: 204
  }
}