const koa = require('koa'); // Koa is a generator-based middleware, request/response model
const app = koa();

app.use(function* (next) { // * is the syntax for generator function
  const start =  new Date; // 1. The timer is setup in the first middleware component
  yield next;  // 2. Execution is yielded to the second middleware component (which renders the body with this.body)
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
// yield keyword produces values one at a time, when the generator is asked for a value
// calling a generator does not execute the generator function, instead it creates an object called ITERATOR through which we control the generator's execution
app.use(function*() {
  this.body = 'Hello World'; // 3. you can control what gets sent to the browser by setting values on this.body . Here execution passes back to the original yield
});

app.listen(3000);
// curl localhost:3000