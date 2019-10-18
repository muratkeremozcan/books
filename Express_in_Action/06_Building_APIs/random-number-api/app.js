var express = require('express');
var app = express(); // create a new express application

// this app shows the fundamentals of building an API with Express: parse requests, set http status codes, send JSON

app.get('/random/:min/:max', (req, res) => { // express get route and its handler
  var min = parseInt(req.params.min); // min & max are passed as parameters to the url, and then parsed
  var max = parseInt(req.params.max); // The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems) https://devdocs.io/javascript/global_objects/parseint
  // built-in JS parseInt() function either returns a number or NaN

  if (isNaN(min) || isNaN(max)) { // error checking: if either parameter could not be parsed to a number
    res.status(400).json({ // respond with status 400 and json
      error: 'Bad request.'
    });
    return; // if we do not return, the function continues and another response is sent, Express would start throwing errors
  }
  var result = Math.round((Math.random() * (max - min)) + min); // Math.random is 0 to 1, range , plus lower limit
  res.json({ // send the calculated result back as json
    result: result
  });
});


app.listen(3000, () => {
  console.log('listening on port 3000');
});

// to run, in browser:  http://localhost:3000/random/10/100
/*
200: OK
HTTP Error 400 : 404 variant, something about the user's request was bad
HTTP Error 401 Unauthorized
HTTP status 403 Forbidden
HTTP status 404 Not Found
HTTP status 500 Internal Server Error
HTTP status 503 Service unavailable
https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

HTTP status ranges in a nutshell:
1xx: hold on
2xx: here you go
3xx: go away
4xx: you messed up
5xx: I messed up

*/