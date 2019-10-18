var http = require('http'); // require Node's built-in http module

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
// in cmd : node index.js
// on browser : try visiting a few other URL s: http://localhost:3000/ or http://localhost:3000/about,  http://localhost:3000/hello/  http://localhost:3000/what?is=anime. The output will change in the console