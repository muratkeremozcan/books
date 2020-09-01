var http = require('http');  // built-in http module for HTTP server & HTTP client functionality
var fs = require('fs'); // built-in file system module for file system related functionality
var path =  require('path'); // built-in path module for path-related functionality
var mime = require('mime'); // mime module that provides the ability to derive a MIME type based on file extension https://en.wikipedia.org/wiki/MIME
var cache = {}; // cache object where the cached file contents are stored

function send404(response){ // helper function to send 404 errors when a file requested does not exist
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found');
  response.end();
}
function sendFile(response, filePath, fileContents) { // helper function to serve file data
  response.writeHead(200, {'content-type': mime.lookup(path.basename(filePath))}); // writes the appropriate HTTP headers
  response.end(fileContents); // sends the contents of the file
}
function serveStatic(response, cache, absPath){ // determine whether a file is cached in memory, if so then serve it
  if (cache[absPath]){ // check if file is cached in memory
    sendFile(response, absPath, cache[absPath]); // serve file from memory
  } else { // if not cached in memory
    fs.exists(absPath, function(exists) { // check if file exists
      if (exists) {
        fs.readFile(absPath, function(err, data) { // read file from disk
          if(err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data); //serve file read from disk
          }
        });
      } else {
        send404(response);
      }
    });
  }
}
var server = http.createServer(function (request, response) {  // create http server using anonymous function to define per-request behavior
  var filePath = false;

  if (request.url == '/') { // determine http file to be served by default
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url; // translate URL path to relative path
  }
  var absPath =  './' + filePath;
  serveStatic(response, cache, absPath); // serve static file
});

server.listen(3000, function() {
  console.log("Server listening on 3000.");
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server); // start the socket io server defined in chat_server.js resource
