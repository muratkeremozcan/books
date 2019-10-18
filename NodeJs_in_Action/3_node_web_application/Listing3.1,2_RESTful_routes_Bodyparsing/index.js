// RESTful API / RESTful web service is an api that uses HTTP requests to GET, POST, PUT, DELETE data https://searchmicroservices.techtarget.com/definition/RESTful-API
const express = require('express'); // Express (framework) focuses on modeling your application in terms of HTTP requests and responses.
const app = express(); // create an application instance
const articles = [{ title: 'Example' }]; // an array of articles
const bodyParser = require('body-parser'); // implementing POST requests requires body parsing. Body parser knows how to accept MIME-encoded POST request bodies and turn them into JSON
// MIME : Multipurpose Internet Mail Extensions

// app.get/set/post/put/delete/use(routeName, routeHandler)
app.set('port', process.env.PORT || 3000); // bind the application to a TCP port

// Listing 3.2 BODY PARSING SUPPORT
app.use(bodyParser.json()); // request MIME-encoded POST request bodies as JSON: JSON body parsing
app.use(bodyParser.urlencoded( {extended: true} )); // form-encoded bodies

app.get('/', (req, res) => { // adding a root route handler
  res.send('Hello World');
});

app.get('/articles', (req, res, next) => { // get all articles
  res.send(articles); // respond with the array of articles. Express automatically converts the array to JSON
});

app.post('/articles', (req, res, next) => { // create an article
  res.send('OK');
});

app.get('/articles/:id', (req, res, next) => { // get a single article
  const id = req.params.id; // request parameter binds with the route and gets assigned to a constant
  console.log('Fetching:', id);
  res.send(article[id]); // respond with the single article
});

app.delete('/articles/:id', (req, res, next) => { // deletes an article
  const id = req.params.id; // request parameter binds with the route and gets assigned to a constant
  console.log('Deleting:', id);
  delete articles[id]; // (the articles are in an array): delete array[index], creates a hole in the array
  res.send({ message: 'Deleted' });
});

app.listen(app.get('port'), () => {
  console.log('App started on port ', app.get('port'));
});

module.exports = app;

// https://curl.haxx.se/
// test with curl :  curl http//localhost:3000/articles  , articles/0
// to post : curl --data "title=Example 2" http://localhost:3000/articles