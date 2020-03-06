const myArray = [1, 2, 3, 4, 5];

// if on 1 line, no ( ) for 1 argument and return statement not needed 
// prints 15
console.log("The sum of myArray elements is " + myArray.reduce((a, b) => a + b));

// prints 2 4
console.log("The even numbers in myArray are " + myArray.filter(value => value % 2 === 0));


// this keyword

// If we hadn’t saved the value of this in that, and used
// this.symbol inside the anonymous function, it would print undefined instead of IBM.
// You’ll see the same behavior not only if a function is invoked inside setInterval (),
// but if a function is invoked in any callback. Inside the callback, this would point at the
// global object, which is not the same as this defined by the StockQuoteGenerator()
// The other solution for ensuring that a function runs in a particular
// this object is to use the JavaScript call(), apply(), or bind() functions.
function StockQuoteGenerator_scopeProblem(symbol) {
  // // this.symbol = symbol;
  const that = this;
  that.symbol = symbol;

  setInterval(function () {
    console.log("The price of " + that.symbol + " is " + Math.random());
  }, 1000);
}
const stockQuoteGenerator_scopeProblem = new StockQuoteGenerator_scopeProblem("IBM");


function StockQuoteGenerator(symbol) {
  this.symbol = symbol;

  // An arrow function that’s given as an argument to setInterval () uses the this value of the enclosing context, so it will
  // recognize IBM as the value of this.symbol
  setInterval(() => {
    console.log("The price of " + this.symbol + " is " + Math.random());
  }, 1000);
}

const stockQuoteGenerator = new StockQuoteGenerator("IBM");

