// USING 3rd party middleware libraries (path module example)
var express = require('express'); // requiring modules
var path = require('path'); // path module provides utilities for working with file and directory paths
var http = require('http');
var app = express(); // start a new Express application by calling the express() function
// IMPORTANT: app is request handler function that starts GOING THROUGH ALL THE MIDDLEWARE until the end
// since it is a request handler function, you can pass the result into http.createServer

var publicPath = path.resolve(__dirname, 'public'); // setup path to the cwd/public folder, using Node's path module. __dirname is a variable for current working directory
app.use(express.static(publicPath)); // EXPRESS.STATIC ships with express and helps you serve static files
// if there is no file under public folder (you can remove it), it will go on to the next middleware and tell you it can't find the file
app.use((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Looks like you didn’t find a static file.");
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});


