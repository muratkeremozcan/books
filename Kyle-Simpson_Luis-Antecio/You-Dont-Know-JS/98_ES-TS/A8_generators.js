// When a browser executes a JavaScript function, it runs without interrupting its own flow to the end. 
// But the execution of a generator function can be paused and resumed multiple times. 
// A generator function can yield control to the calling script, which runs on the same thread.
// Generator functions are useful when we need to write a function to produce a stream of data, but we want to control when to handle the next stream value.

// As soon as the code in a generator function reaches the yield keyword, it gets suspended, and the calling script can resume the function’s execution by calling next ()
// To turn a regular function into a generator, we need to place an asterisk between the function keyword and the function name.

function* doSomething() {
  console.log('started processing');
  yield;
  console.log('resumed processing');
}
// When we invoke this function, it doesn’t immediately execute the function code but returns a special Generator object, which serves as an iterator
// The following line won’t print anything:
var iterator = doSomething();
iterator //?
// To start executing the body of the function, we need to call the next() method on the generator
iterator.next();
// function will print “Started processing” and will be suspended because of the yield operator. 
// Calling next() again will print “Resumed processing.”
iterator.next();

///////////////
function* getStockPrice(symbol) {
  while(true) {
    yield Math.random()*100;
    console.log(`resuming for ${symbol}`);
  }
}
const priceGenerator = getStockPrice('IBM'); // creates a Generator (does not execute the body of the function)

// sets limit to 15 and initial price to 100
const limitPrice = 15; 
let price = 100;

// keeps requesting stock prices until they fall below 15
while (price > limitPrice) {
  price = priceGenerator.next().value;
  console.log(`The generator returned ${price}`);
}
// if the price drops under 15, buys the stock
console.log(`buying at ${price} !!!`);