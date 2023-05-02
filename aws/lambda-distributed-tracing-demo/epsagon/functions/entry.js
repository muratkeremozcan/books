const http = require('axios')

module.exports.handler = async (event) => {
  const host = event.headers.Host;
  const url = `https://${host}/${process.env.STAGE}/secondary`;
  console.log(url)

  await http.post(url, event.body)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
}