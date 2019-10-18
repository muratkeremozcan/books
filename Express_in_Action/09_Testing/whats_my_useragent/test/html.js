var app = require('../app');
var supertest = require('supertest');
var cheerio = require('cheerio');

describe('html response', () => {
  
  var request;
  beforeEach(() => {
    request = supertest(app)
      .get('/')
      .set('User-Agent', 'a cool browser')
      .set('Accept', 'text/html');
  });
  it("returns an HTML response", (done) => {
    request
      .expect('Content-type', /html/)
      .expect(200)
      .end(done);
  });

  // you need to be able to look through the HTML and find the User Agent inside.
  // If you were in the browser, you could use jQuery to do this. Because you’re in Node, you’ll use Cheerio
  // Here, you use Cheerio to parse your HTML and make sense of it as you do with jQuery
  it("returns your User Agent", (done) => {
    request
      .expect(function(res) {
        var htmlResponse = res.text;
        var $ = cheerio.load(htmlResponse); // initializes cheerio object from your html
        var userAgent = $('.user-agent').html().trim(); // gets the userAgent from html
        if (userAgent !== 'a cool browser') { // tests for useragent like before
          throw new Error("User Agent not found (found: " + userAgent + ")");
        }
      })
      .end(done);
  });
});

