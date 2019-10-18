var app = require('../app');
var supertest = require('supertest');
// to test the routes or middleware of your Express applications, you might want to make sure that your API endpoints are returning the values they should, or that you’re serving static files, or a number of other things.
// These are often called integration tests because they test the integrated system as a whole.
// SuperTest spools up your Express server and sends requests to it. Once the requests come back, you can make assertions about the response.

describe('plain text response', () => {
  var request;
  beforeEach(() => {
    request = supertest(app) // supertest builds up the request. Wrap your app up by calling supertest with app as an argument. This returns a SuperTest object.
      .get('/') // call get on that SuperTest object with the route you want to request
      .set('User-Agent', 'a cool browser') // set options on this request; in this case, you’re setting the User-Agent header to "my cool browser" and the Accept header to text/plain
      .set('Accept', 'text-plain') // sets a header describing what content type we want back from the server
  });
  it('returns a plain text response', (done) => {
    request // using the request variable, so we do not have to repeat code
      .expect('Content-Type', /text\/plain/) // expects content to match "text/plain" regex
      .expect(200) // expect http 200 ok
      .end(done) // calls the done callback, used to signal that asynchronous tests are done
  });
  it('returns your user agent', (done) => {
    request // using the request variable, so we do not have to repeat code
      .expect(function(res) {
        if (res.text !== 'a cool browser') {
          throw new Error('Response does not contain User Agent'); // throw error if you don't get the right user agent string
        }
      })
      .end(done);
  });
});