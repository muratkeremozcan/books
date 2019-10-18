var http = require("http");
var path = require("path");  // path module provides utilities for working with file and directory paths
var logger = require("morgan"); // morgan is a logging middleware component with customizable log formats
var bodyParser = require("body-parser");  // parses the request body into request.body. Implementing POST requests requires body parsing. Body parser knows how to accept MIME-encoded POST request bodies and turn them into JSON
var express = require("express");
var app = express();

app.set('views', path.resolve(__dirname, 'views')); // CONFIGURING the VIEWS setting: specifies the directory Express will use during view lookup. Resolves a sequence of paths or path segments into an absolute path https://nodejs.org/api/path.html#path_path_join_paths
app.set('view engine', 'ejs'); // CONFIGURING the VIEW ENGINE: enables you to render ejs files correctly

var entries = []; // a global array to store all your entries
app.locals.entries = entries; // makes a variable available in all views. app.locals (like response.locals) is used by Express to expose data to templates

app.use(logger('dev')); // MIDDLEWARE FOR ALL DEBUGGING/LOGGING.using morgan to log every request. Previously we used   app.use(logger('short'))

app.use(bodyParser.urlencoded( {extended: false})); // MIDDLEWARE for body parsing. populates a variable called req.body if the user is submitting a form (the extended option is required)

app.get('/', (request, response) => { // ROUTE for homepage. When visiting the site root, renders the homepage at views/index.ejs
  response.render('index');  // RESPONSE.RENDER renders a html template (render the file index.ejs) Renders a view and sends the rendered HTML string to the client http://expressjs.com/en/4x/api.html#res.render
});

app.get('/new-entry', (request, response) => { // ROUTE for GET new-entry. Renders the new-entry page at views/new-entry.ejs when GETting the url
  response.render('new-entry');
});

app.post('/new-entry', (request, response) => { // ROUTE for POST new-entry. Defines a ROUTE when you POST to the new-entry URL, in contrast to GET
  if (!request.body.title || !request.body.body) { // if user submits the form and either title or content/body are missing
    response.status(400).send('Entries must have a title and a body'); // Express functions RESPONSE.STATUS and RESPONSE.SEND to send status code
    return;
  }
  entries.push({ // adds a new entry to the list of entires
    title: request.body.title, // bodyParser parses the request body into request.body, turns them into JSON
    body: request.body.body,
    published: new Date()
  });
  response.redirect('/'); // redirects to the homepage to see your entry. Express adds .redirect method to the response object for you // Redirects to the URL derived from the specified path http://expressjs.com/en/4x/api.html#res.redirect
});

app.use((request,response) => { // MIDDLEWARE TO SERVE 404. if no new-entry or site root, then we requested an unknown page. So this renders a 404 page because a request was made for an unknown source
  response.status(404).render(404); // Express functions RESPONSE.STATUS and RESPONSE.SEND to send status code
});
// HTTP Error 401 Unauthorized
// HTTP status 403 Forbidden
// HTTP status 404 Not Found
// HTTP status 500 Internal Server Error
// HTTP status 503 Service unavailable
// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

app.listen(3000, function() {
  console.log('Guestbook app started on port 3000');
});