var express = require('express');
var app = express();

app.get('/', (req, res) => { // GET / read . Idempotent: many runs, same result
  res.send('you sent a GET request');
});

app.post('/', (req, res) => { // POST / create/write . Non-idempotent: different result every run
  res.send('you sent a POST request');
});

app.put('/', (req, res) => { // PUT / update . Idempotent: many runs, same result. Do not care what it was, updating it to certain something. Sometimes can work as POST if nothing existed before
  res.send('you sent a PUT request');
});

app.delete('/', (req, res) => { // DELETE . Idempotent: many runs, same result
  res.send('you sent a DELETE request');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

// to run use curl with -X argument. by default curl sends GET requests
// curl http://localhost:3000
// curl -X POST http://localhost:3000
// curl -X PUT http://localhost:3000
// curl -X DELETE http://localhost:3000

// NOTE about PATCH method/verb: the PUT method is already defined to over-write a resource with a complete new body, and cannot be reused to do partial changes. 
// PATCH allows you to partially overwrite a resource. PATCH was only formally defined in 2010, so it’s relatively new on the HTTP scene