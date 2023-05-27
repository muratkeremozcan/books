const APP_ROOT = '../../'
const AWS = require('aws-sdk')
const ApiGateway = new AWS.APIGateway()
const aws4 = require('aws4')
const URL = require('url')
const http = require('axios')

const getApiKey = async () => {
  const result = await ApiGateway.getApiKey({
    apiKey: process.env.DefaultApiKeyId,
    includeValue: true
  }).promise()

  return result.value
}

const signHttpRequest = (url, method, headers, body) => {
  const urlData = URL.parse(url)
  const opts = {
    host: urlData.hostname,
    path: urlData.pathname,
    method,
    headers,
    body,
  }

  aws4.sign(opts)
  return opts.headers
}

const viaHttp = async (relPath, method, opts) => {
  const url = `${process.env.ApiUrl}/${relPath}`
  console.info(`invoking via HTTP ${method} ${url}`)

  try {
    let headers = {}
    const data = opts?.body
    if (data) {
      headers['Content-Type'] = 'application/json'
    }

    if ((opts?.iam_auth || false) === true) {
      headers = signHttpRequest(url, method, headers, data)
    }

    const authHeader = opts?.auth
    if (authHeader) {
      headers.Authorization = authHeader
    }

    if ((opts?.api_key || false) == true) {
      headers['x-api-key'] = await getApiKey()
    }

    const httpReq = http.request({
      method, url, headers, data
    })

    const res = await httpReq
    return {
      statusCode: res.status,
      body: res.data,
      headers: res.headers
    }
  } catch (err) {
    if (err.response?.status) {
      return {
        statusCode: err.response.status,
        headers: err.response.headers
      }
    } else {
      throw err
    }
  }
}

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

const we_invoke_add_restaurant = async (restaurant) => {
  const body = JSON.stringify(restaurant)
  return await viaHandler({ body }, 'add-restaurant')
}

const we_invoke_list_restaurants = async (count, nextToken) => {
  const queryStringParameters = {
    count: count ? count.toString() : undefined,
    nextToken
  }
  return await viaHandler({ queryStringParameters }, 'list-restaurants')
}

const we_invoke_search_restaurants = async (searchPhrase) => {
  const body = JSON.stringify({ searchPhrase })
  return await viaHandler({ body }, 'search-restaurants')
}

const we_invoke_add_restaurant_remotely = async (restaurant) => {
  const body = JSON.stringify(restaurant)
  return await viaHttp('restaurants', 'POST', { body, iam_auth: true })
}

const we_invoke_list_restaurants_remotely = async (user, count, nextToken) => {
  const auth = user.idToken
  let url = 'restaurants'
  if (count || nextToken) {
    // '' is required here, otherwise, it prints 'undefined'
    url += `?count=${count || ''}&nextToken=${nextToken || ''}`
  }

  return await viaHttp(url, 'GET', { auth })
}

const we_invoke_search_restaurants_remotely = async (searchPhrase) => {
  const body = JSON.stringify({ searchPhrase })
  return await viaHttp('search', 'POST', { body, api_key: true })
}

const we_invoke_get_restaurant_remotely = async (id) => {
  return await viaHttp(`restaurants/${id}`, 'GET')
}

module.exports = {
  we_invoke_add_restaurant,
  we_invoke_list_restaurants,
  we_invoke_search_restaurants,
  we_invoke_add_restaurant_remotely,
  we_invoke_list_restaurants_remotely,
  we_invoke_search_restaurants_remotely,
  we_invoke_get_restaurant_remotely,
}