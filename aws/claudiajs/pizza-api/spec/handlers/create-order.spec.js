// any time the handler is making external http requests (nock, sinon), and or has db dependencies, you want to mock

const createOrder = require('../../handlers/create-order')
// mock http requests
const fakeHttpRequest = require('fake-http-request'); // nock alternative
const https = require('https'); // fakeHttpRequest uses it for tracking mocked requests
// required mock docClient.put 
const AWS = require('aws-sdk')

let docClientMock;

describe('Create order handler', () => {
  beforeEach(() => {
    fakeHttpRequest.install('https'); // needed to use the fakeHttpRequest module

    // mock the DB
    docClientMock = jasmine.createSpyObj('docClient', {
      put: { promise: Promise.resolve.bind(Promise) },
      configure() { }
    });
    AWS.DynamoDB.DocumentClient.prototype = docClientMock;
  });

  afterEach(() => {
    fakeHttpRequest.uninstall('https'); // needed to use the fakeHttpRequest module
  });

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
    expect(() => createOrder({
      pizza: 5,
      address: " 1234 Sesame Street"
    })).not.toThrow()
  });

  it('should send POST request to Some Like It Hot delivery API', (done) => {

  });
});

