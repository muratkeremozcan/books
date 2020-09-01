var express = require('express');
var path = require('path'); // built-in node module which will let you determine the path the user requests
var fs = require('fs'); // will be used to determine if a file exists
var morgan = require('morgan'); // Morgan is the request logger middleware
var app = express(); // creates an Express application and puts it inside a variable

// instead of a creating our own logger, we can use Morgan
app.use(morgan("short")); // Morgan has configuration options such as "short"  "tiny"  and  "combined" - which is big https://github.com/expressjs/morgan

// instead of our own file server middleware, can use express.static . If the file exists, it sends it, if not it will continue to the next middleware stack
var filePath = path.join(__dirname, 'static'); // no need for req.url like before: path.join(__dirname, 'static', req.url)
app.use(express.static(filePath)); // all the error checking is done for us, with performance and security improvements

app.use((req, res) => { // next arg. isn't needed because this is the final middleware
  res.status(404).send('File not found!');
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});