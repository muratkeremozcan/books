function foo(...args) { // gathers arguments (rest)
  // args is already a real array

  // discard first element
  args.shift();

  // pass along all of 'args' as arguments to console - spreads them out (spread)
  console.log(...args);
}


// pre ES6
function bar() {
  // (1) have to turn args to a real array
  let args = Array.prototype.slice.call(arguments);

  // add some elements to the end
  args.push(4, 5);

  // filter out odd numbers 
  args = args.filter(function(v) {
    return v % 2 == 0;
  });

  // (2) pass along all of 'args' as arguments to foo()
  foo.apply(null, args);
}

bar (0, 1, 2, 3);


// with ES6
function foof(...args) { // gathers arguments (rest)
  // (1) args is already a real array

  // add some elements to the end (same, not comparison relevant)
  args.push(4, 5);

  // filter out odd numbers (arrow function, not comparison relevant)
  args = args.filter(v => v % 2 == 0);

  // (2) pass along all of 'args' as arguments to foo()
  foo(...args); // spreads arguments
}

foof(0, 1, 2, 3);