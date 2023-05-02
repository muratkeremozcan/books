const APP_ROOT = '../../'

const viaHandler = async (event, functionName) => {
  const handler = require(`${APP_ROOT}/functions/${functionName}`).handler

  const context = {}
  const response = await handler(event, context)
  const headers = response?.headers || {}
  const contentType = headers['content-type'] || 'application/json'
  if (response?.body && contentType === 'application/json') {
    response.body = JSON.parse(response.body)
  }
  return response
}

const we_invoke_get_cart = async (userId) => {
  const pathParameters = { userId }
  return await viaHandler({ pathParameters }, 'get-cart')
}

const we_invoke_add_item = async (userId, item) => {
  const pathParameters = { userId }
  const body = JSON.stringify(item)
  return await viaHandler({ pathParameters, body }, 'add-item')
}

module.exports = {
  we_invoke_get_cart,
  we_invoke_add_item,
}