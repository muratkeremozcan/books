var express = require('express');
var path = require('path'); // built-in node module which will let you determine the path the user requests
var fs = require('fs'); // will be used to determine if a file exists
var morgan = require('morgan'); // Morgan is the request logger middleware
var app = express(); // creates an Express application and puts it inside a variable

// instead of a creating our own logger, we can use Morgan
app.use(morgan("short")); // Morgan has configuration options such as "short"  "tiny"  and  "combined" - which is big https://github.com/expressjs/morgan

app.use((req, res, next) => {
  if (req.url === '/') {
    next(); // if no error, proceed as usual to the next middleware
  } else if (req.url === '/throw' ) {
    throw new Error ('Gimme that error');
  } else {
    next('You didn\'t visit the root!'); // to enter error mode, call next with an argument. IF there is an error EXPRESS WILL SKIP TO THE ERROR HANDLING MIDDLEWARE
  }
});

app.use(function(req, res) { // if no errors, we end up here
  res.send("Welcome to the homepage.");
});

app.use((err, req, res, next) => { // error logging middleware. Same as other middleware but with an extra  error argument. EXPRESS WILL SKIP TO HERE if there is error
  console.error(err); // log the error (this error has to have been generated in a previous middleware and fell down here)
  next(err); // you can continue to the NEXT error handling middleware by calling next(err)
});

app.use(function(err, req, res, next) {
  res.status(500).send('Got an error' + err);
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});