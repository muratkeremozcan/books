var express = require('express'); // requiring modules
var http = require('http');
var app = express(); // start a new Express application by calling the express() function
// IMPORTANT: app is request handler function that starts GOING THROUGH ALL THE MIDDLEWARE until the end
// since it is a request handler function, you can pass the result into http.createServer

app.use((request, response, next) => { // MIDDLEWARE
  console.log('In comes a ' + request.method + ' request to: ' + request.url);
  next(); // enables to move on to the next middleware
});

app.use((request, response, next) => {
  var minute = (new Date()).getMinutes();
  if ((minute % 2 === 0)){ // if it's an even minute, move on
    next();
  } else {
    response.statusCode = 403;
    response.end('Not authorized');
  }
});

app.use((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});

http.createServer(app)
  .listen(3000, function () { // start the server. http.createServer takes a function
    console.log('listening on port 3000');
  });

// APP.LISTEN(...) is shorthand for http.createServer(app).listen
// app.listen(3000, function () { // start the server. http.createServer takes a function
//   console.log('listening on port 3000');
// });