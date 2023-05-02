const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')
const http = require('@dazn/lambda-powertools-http-client')

module.exports.handler = wrap(async (event) => {
  const host = event.headers.Host;
  const url = `https://${host}/${process.env.STAGE}/secondary`;
  Log.debug('configured secondary URL', { url })

  const options = {
    uri: url,
    method: 'post',
    body: {}
  }

  await http(options)

  return {
    statusCode: 200,
    body: JSON.stringify({      
    })
  }
})