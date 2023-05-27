const { getOrder, setConfirmationToken } = require('../lib/orders')

module.exports.handler = async (input) => {
  const { orderId, taskToken } = input
  
  const order = await getOrder(orderId)
  if (!order) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Order is not found.'
      })
    }
  }

  await setConfirmationToken(orderId, taskToken)
}