'use strict'

const underTest = require('../../handlers/create-order')
const https = require('https')
const fakeHttpRequest = require('fake-http-request')
const AWS = require('aws-sdk')
let docClientMock

describe('Create order handler', () => {
  beforeEach(() => {
    fakeHttpRequest.install('https')

    docClientMock = jasmine.createSpyObj('docClient', {
      put: { promise: Promise.resolve.bind(Promise) },
      configure() { }
    })
    AWS.DynamoDB.DocumentClient.prototype = docClientMock
  })

  afterEach(() => fakeHttpRequest.uninstall('https'))

  it('should throw an error if request is not valid', () => {
    expect(() => underTest()).toThrow()
    expect(() => underTest({})).toThrow()
    expect(() => underTest('A')).toThrow()
    expect(() => underTest(1)).toThrow()
    expect(() => underTest({ body: {} })).toThrow()
    expect(() => underTest({ body: { pizza: 1 } })).toThrow()
    expect(() => underTest({ body: { address: '221b Baker Street' } })).toThrow()
  })

  it('should send POST request to Some Like It Hot delivery API', (done) => {
    underTest({
      body: {
        pizza: 1,
        address: '221b Baker Street'
      }
    })
    
    https.request.pipe((callOptions) => {
      expect(https.request.calls.length).toBe(1)
      expect(callOptions).toEqual(jasmine.objectContaining({
        protocol: 'https:',
        slashes: true,
        host: 'some-like-it-hot-api.effortlessserverless.com',
        path: '/delivery',
        method: 'POST',
        headers: {
          Authorization: 'aunt-marias-pizzeria-1234567890',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          pickupTime: '15.34pm',
          pickupAddress: 'Aunt Maria Pizzeria',
          deliveryAddress: '221b Baker Street',
          webhookUrl: 'https://g8fhlgccof.execute-api.eu-central-1.amazonaws.com/latest/delivery'
        })
      }))
      done()
    })
  })

  it('should call the DynamoDB DocumentClient.put if Some Like It Hot delivery API request was successful', (done) => {
    underTest({
      body: { pizza: 1, address: '221b Baker Street' }
    })
      .then(() => {
        expect(docClientMock.put).toHaveBeenCalled()
        done()
      })
      .catch(done.fail)

    https.request.pipe((callOptions) => https.request.calls[0].respond(200, 'Ok', '{}'))
  })

  it('should not call the DynamoDB DocumentClient.put if Some Like It Hot delivery API request was not successful', (done) => {
    underTest({
      body: { pizza: 1, address: '221b Baker Street' }
    })
      .then(done.fail)
      .catch(() => {
        expect(docClientMock.put).not.toHaveBeenCalled()
        done()
      })

    https.request.pipe((callOptions) => https.request.calls[0].respond(500, 'Server Error', '{}'))
  })

  it('should resolve the promise if everything went fine', (done) => {
    underTest({
      body: { pizza: 1, address: '221b Baker Street' }
    })
      .then(done)
      .catch(done.fail)

    https.request.pipe((callOptions) => https.request.calls[0].respond(200, 'Ok', '{}'))
  })

  it('should reject the promise if something went wrong', (done) => {
    underTest({
      body: { pizza: 1, address: '221b Baker Street' }
    })
      .then(done.fail)
      .catch(done)

    https.request.pipe((callOptions) => https.request.calls[0].respond(500, 'Server Error', '{}'))
  })
})