const XRay = require('aws-xray-sdk-core')
const https = XRay.captureHTTPs(require('https'))

module.exports.handler = (event, context, callback) => {
  const host = event.headers.Host;
  const url = `https://${host}/${process.env.STAGE}/secondary`;
  console.log(url)

  const options = {
    hostname: host,
    port: 443,
    path: `/${process.env.STAGE}/secondary`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': event.body.length
    }
  }

  req = https.request(options, (res) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({})
    })
  })
  
  req.on('error', (e) => {
    callback(e)
  })
  
  req.write(event.body)
  req.end()
}