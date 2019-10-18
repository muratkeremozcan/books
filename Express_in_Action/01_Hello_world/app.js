var express = require('express'); // require express, put it in a variable
var app = express(); // call express, put Express application in a variable

app.get('/', (request, response) => {
  response.send('Hello world');
});

app.listen(3000, () => {
  console.log('listening on port 3000...');
});