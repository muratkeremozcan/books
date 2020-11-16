var express = require("express");
var app = express();

// Routes map http verb & URI to a request handler function

// SIMPLE ROUTING EXAMPLE
app.get('/olivia', (req, res) => { // routes get requests to /olivia to the request handler
  res.send('Welcome to Olivia\'s homepage');
});

// PARAMETER ROUTING EXAMPLE // will match requests to /users/123 and /users/horse_ebooks  . Anything will go
app.get('/users/:userid', (req, res) => { //  put the parameter it in your route with a colon in front of it.
  var userId = parseInt(req.params.userid, 10); // To grab the value, you’ll look inside the params property of the request .  req.params.userid  is  :userid
  res.send('user id is ', + userId); // The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems) https://devdocs.io/javascript/global_objects/parseint
});

// REGEX ROUTING EXAMPLE // will only match a specific route as :  /users/<a number>>  like /users/123 or /users/456
app.get(/^\/users\/(\d+)$/, (req, res) => { // You can use Regex to define routes. No quotes ' ', but regex expression /^ ... $/
  var userId = parseInt(req.params[0], 10); // Regex defined routes get passed in as req.params[0] for the 1st captured parameter  .   req.params[0]  is the whole regex capture
  res.send('user id is ', + userId);
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});