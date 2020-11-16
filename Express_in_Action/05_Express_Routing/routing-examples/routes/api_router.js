var express = require('express');
var api = express.Router(); 

var ALLOWED_IPS = [
  '127.0.0.1',
  '123.456.7.89'
];

api.use((req, res, next) => {
  var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
  if(!userIsAllowed){
    res.status(401).send('not authorized!');
  } else {
    next();
  }
});

api.get('/users', (req, res) => {
  // bla
});
api.post('/users', (req, res) => {
  // bla
});
api.get("/messages", function(req, res) { /* ... */ });
api.post("/message", function(req, res) { /* ... */ });

module.exports = api;