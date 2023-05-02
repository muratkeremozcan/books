const http = require('axios')
const thundra = require("@thundra/core")()

module.exports.handler = thundra(async (event) => {
  const host = event.headers.Host;
  const url = `https://${host}/${process.env.STAGE}/secondary`;
  console.log(url)

  await http.post(url, event.body)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})
