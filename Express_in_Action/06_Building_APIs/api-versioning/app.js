// to create different versions of you API, you create routers that handle the matching versions
// routers let you segment different routes to different files. Versioned APIs are a good example of the utility of routers

var express = require('express');
var app = express();

var apiVersion1 = require('./api1');
var apiVersion2 = require('./api2');

app.use('/v1', apiVersion1);
app.use('/v2', apiVersion2);

app.listen(3000, () => {
  console.log('listening on port 3000');
});

// to run : browser or curl  http://localhost:3000/v1/all_timezones,  http://localhost:3000/v2/timezones  , 4 combinations...etc.