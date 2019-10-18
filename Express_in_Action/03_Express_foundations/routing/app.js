// ROUTING is a way to map url path requests to specific request handler functions. APP.GET("path", <request_handler_function) . also PUT, POST, DELETE and other HTTP verbs
// The delta with MIDDLEWARE is that middleware flows through and routing takes paths APP.USE(<request_handler_function>

var express = require('express'); // requiring modules
var logger = require('morgan'); // morgan is a logging middleware component with customizable log formats
var path = require('path'); // path module provides utilities for working with file and directory paths
var http = require('http');
var app = express(); // start a new Express application by calling the express() function
// IMPORTANT: app is request handler function that starts GOING THROUGH ALL THE MIDDLEWARE until the end, CAN ALSO GO THROUGH ROUTES!
// since it is a request handler function, you can pass the result into http.createServer(app).listen(3000) (or shorthand app.listen(3000))

var EVIL_IP = "123.45.67.89";

app.use((request, response, next) => { // helpful Express functions for request:  REQUEST.IP  . The full list here: http://expressjs.com/en/4x/api.html
  if(request.ip === EVIL_IP) { // request.ip to get the ip address of the request
    response.status(401).send("Not allowed"); // RESPONSE.STATUS and RESPONSE.SEND to send status code
  } else {
    next();
    // you also have methods for response like REDIRECT and SENDFILE
    // response.redirect("/hello/world"); // Redirects to the URL derived from the specified path http://expressjs.com/en/4x/api.html#res.redirect
    // response.redirect("http://expressjs.com");
    // response.sendFile("/path/to/cool_song.mp3");
  }
});

app.get('/', (request, response) => { // route the request to root path
  response.end('Welcome to my homepage!');
});

app.get('/about', (request, response) => {
  response.end('Welcome to my about page!');
});

app.get('/weather', (request,response) => {
  response.end('Welcome to my weather page!');
});

app.get("/hello/:who", (request, response) => {
  response.end("Hello " + request.params.who); // request parameter binds with the route. Think of it as request.params = /hello/:
});

app.use((request, response) => { // the only MIDDLEWARE. If you miss the above routes, it ends up here
  response.statusCode = 404; // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  response.end('404!');
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});


// HTTP Error 401 Unauthorized
// HTTP status 403 Forbidden
// HTTP status 404 Not Found
// HTTP status 500 Internal Server Error
// HTTP status 503 Service unavailable
// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes


/* Recall how this was done in Node, we could only use 1 request handler function

http.createServer((request, response) => { // callback to handle incoming http requests. Called every time a request comes into your server
  console.log('In comes a request to: ' + request.url);
  if(request.url === "/") { // request handler function
    response.end("Welcome to the homepage!");
  } else if (request.url === "/about") {
    response.end("Welcome to the about page");
  } else {
    response.end('Hello world');
  }
}).listen(3000, function() {
  console.log('listening on port 3000');
});


*/