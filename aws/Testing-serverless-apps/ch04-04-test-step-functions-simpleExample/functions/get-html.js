const axios = require('axios')

module.exports.handler = async ({ url }) => {
  const result = await axios(url)

  const size = result.data.length
  return {
    url,
    size
  }
}