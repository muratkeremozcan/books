var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('views', path.resolve(__dirname, 'views')); // CONFIGURING the VIEWS setting: specifies the directory Express will use during view lookup. Resolves a sequence of paths or path segments into an absolute path https://nodejs.org/api/path.html#path_path_join_paths
app.set('view engine', 'ejs'); // CONFIGURING the VIEW ENGINE: enables you to render ejs files correctly

app.get('/', (request,response) => { // index is the file name to render, message is the variable to interpolate
  response.render('index', { // RESPONSE.RENDER renders a html template (render the file index.ejs) Renders a view and sends the rendered HTML string to the client http://expressjs.com/en/4x/api.html#res.render
    message: 'Hey everyone! This is my webpage.' // the passed in variable 'message' will be interpolated in the index.ejs template
  });
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});