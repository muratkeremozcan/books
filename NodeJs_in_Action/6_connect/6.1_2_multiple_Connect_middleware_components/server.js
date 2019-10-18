const connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url); // prints http method and requests url, calls next()
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain'); // ends response to HTTP request with "hello world"
  res.end('Hello world!');
}
connect()
.use(hello) // switch for 6.2. If hello is called first, logging never happens because hello does not call next()
  .use(logger)
  .listen(3000);
// IMPORTANT: if a component does not call nex(), remaining middleware in the chain will not be invoked