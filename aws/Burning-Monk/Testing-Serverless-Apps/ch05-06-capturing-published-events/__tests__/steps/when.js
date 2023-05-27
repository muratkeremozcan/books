const axios = require('axios')

const we_invoke_api = async () => {
  const handler = require('../../functions/api').handler
  return await handler({})
}

const we_invoke_eventbridge = async (id, message, source) => {
  const handler = require('../../functions/eventbridge').handler

  const event = {
    source,
    detail: {
      id,
      message
    }
  }
  return await handler(event)
}

const we_invoke_dynamodb = async (eventName, newImage, oldImage) => {
  const handler = require('../../functions/dynamodb').handler

  const event = {
    Records: [{
      eventName,
      dynamodb: {
        NewImage: newImage,
        OldImage: oldImage
      }
    }]
  }
  return await handler(event)
}

const we_invoke_sns = async (id, message) => {
  const handler = require('../../functions/sns').handler

  const event = {
    Records: [{
      Sns: {
        Message: message,
        MessageAttributes: {
          id: {
            Type: 'String',
            Value: id
          }
        }
      }
    }]
  }
  return await handler(event)
}

const we_hit_http_endpoint = async (method, relativePath, data) => {
  const resp = await axios({
    method,
    url: `${process.env.ApiUrl}/${relativePath || ""}`,
    data
  })

  return {
    statusCode: resp.status,
    body: resp.data
  }
}

module.exports = {
  we_invoke_api,
  we_invoke_eventbridge,
  we_invoke_dynamodb,
  we_invoke_sns,
  we_hit_http_endpoint,
}