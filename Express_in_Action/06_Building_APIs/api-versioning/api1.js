var express = require('express');
var api = express.Router(); // defining an express router with express.Router

api.get('/timezone', (req, res) => {
  res.send('Sample response for /timezone');
});

api.get('/all_timezones', (req, res) => {
  res.send('Sample response for /all_timezones')
});

module.exports = api; // must export the router