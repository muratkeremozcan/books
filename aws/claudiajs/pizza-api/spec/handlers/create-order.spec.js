// any time the handler is making external http requests (nock, sinon), and or has db dependencies, you want to mock

const createOrder = require('../../handlers/create-order')
// mock http requests
const fakeHttpRequest = require('fake-http-request'); // nock alternative
const https = require('https'); // fakeHttpRequest uses it for tracking mocked requests
// required mock docClient.put 
const AWS = require('aws-sdk')

let docClientMock;

describe('Create order handler', () => {

  const payload = {
    pizza: 1,
    address: '221b Baker Street'
  };

  beforeEach(() => {
    fakeHttpRequest.install('https'); // needed to use the fakeHttpRequest module

    // KEY: mock the DB
    docClientMock = jasmine.createSpyObj('docClient', {
      put: { promise: Promise.resolve.bind(Promise) },
      configure() { }
    });
    AWS.DynamoDB.DocumentClient.prototype = docClientMock;
  });

  afterEach(() => fakeHttpRequest.uninstall('https')); // needed to use the fakeHttpRequest module

  it('should throw an error if request is not valid', () => {
    const errMsg = 'To order pizza please provide pizza type and address where pizza should be delivered';
    expect(() => createOrder()).toThrowError(errMsg);
    expect(() => createOrder({})).toThrowError(errMsg);
    expect(() => createOrder('A')).toThrowError(errMsg);
    expect(() => createOrder(1)).toThrowError(errMsg);
    expect(() => createOrder({})).toThrowError(errMsg);
    expect(() => createOrder({ pizza: 1 })).toThrow();
    expect(() => createOrder({ address: '221b Baker Street' })).toThrowError(errMsg);
  });

  it('should not throw an error if the request is valid', () => {
    expect(() => createOrder(payload)).not.toThrow()
  });

  describe('Post request', () => {
    it('should send POST request to Some Like It Hot delivery API', (done) => {
      createOrder(payload);

      // fake-http-request adds a pipe method to https.request, 
      // so you can use that method to check if the HTTPS request is sent with the expected values
      https.request.pipe((callOptions) => {
        expect(https.request.calls.length).toBe(1);

        // this fully replicates the rp.post fn on create-order.js
        expect(callOptions).toEqual(jasmine.objectContaining({
          protocol: 'https:',
          slashes: true,
          host: 'some-like-it-hot.effortless-serverless.com',
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
            webhookUrl: 'https://2afo7guwib.execute-api.us-east-1.amazonaws.com/latest/delivery'
          })
        }));
        done();
      });
    });

    it('should call the DynamoDB DocumentClient.put if Some Like It Hot delivery API request was successful', (done) => {
      https.request.pipe(() => https.request.calls[0].respond(200, 'Ok', '{}'));

      createOrder(payload)
        .then(() => {
          expect(docClientMock.put).toHaveBeenCalled();
          done();
        })
        .catch(done.fail)
    });

    it('should not call the DynamoDB DocumentClient.put if Some Like It Hot delivery API request was unsuccessful', (done) => {
      https.request.pipe(() => https.request.calls[0].respond(500, 'Server Error', '{}'));

      createOrder(payload)
        .then(done.fail)
        .catch(() => {
          expect(docClientMock.put).not.toHaveBeenCalled();
          done();
        });
    });
  });
});

