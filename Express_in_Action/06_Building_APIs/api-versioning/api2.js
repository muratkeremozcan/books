var express = require('express');
var api = express.Router(); // defining an express router with express.Router

api.get('/timezone', (req, res) => {
  res.send('API 2: super cool new response for /timezone');
});

api.get('/all_timezones', (req, res) => {
  res.send('API 2: super cool new response for /all_timezones');
});

module.exports = api;