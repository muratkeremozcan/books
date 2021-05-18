'use strict'

const underTest = require('../../handlers/create-order') // <1>
const AWS = require('aws-sdk') // <2>
const dynamoDb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'eu-central-1'
})
const https = require('https') // <3>
const fakeHttpRequest = require('fake-http-request')

const tableName = `pizzaOrderTest${new Date().getTime()}` // <4>
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000 // <5>

describe('Create order (integration)', () => {
  beforeAll((done) => {
    const params = {
      AttributeDefinitions: [{
        AttributeName: 'orderId',
        AttributeType: 'S'
      }],
      KeySchema: [{
        AttributeName: 'orderId',
        KeyType: 'HASH'
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: tableName
    }

    dynamoDb.createTable(params).promise() // <6>
      .then(() => dynamoDb.waitFor('tableExists', { // <7>
        TableName: tableName
      }).promise())
      .then(done)
      .catch(done.fail)
  })

  afterAll(done => {
    dynamoDb.deleteTable({ // <8>
      TableName: tableName
    }).promise()
      .then(() => dynamoDb.waitFor('tableNotExists', { // <9>
        TableName: tableName
      }).promise())
      .then(done)
      .catch(done.fail)
  })

  beforeEach(() => fakeHttpRequest.install({ // <10>
    type: 'https',
    matcher: /some-like-it-hot-api/
  }))

  afterEach(() => fakeHttpRequest.uninstall('https'))

  it('should save the order in the DynamoDB table if Some Like It Hot delivery API request was successful', (done) => {
    underTest({
      body: { pizza: 1, address: '221b Baker Street' }
    }, tableName)
      .then(rawResponse => JSON.parse(rawResponse.body))
      .then(response => {
        const params = {
          Key: {
            orderId: {
              S: response.deliveryId
            }
          },
          TableName: tableName
        }

        dynamoDb.getItem(params).promise()
          .then(result => {
            console.log(result)
            expect(result.Item.orderId.S).toBe(response.deliveryId)
            expect(result.Item.address.S).toBe('221b Baker Street')
            expect(result.Item.pizza.N).toBe('1')
            done()
          })
          .catch(done.fail)
      })
      .catch(done.fail)

    https.request.pipe((callOptions) => https.request.calls[0].respond(200, 'Ok', JSON.stringify({
      deliveryId: 'order-id-from-delivery-api'
    })))
  })

})