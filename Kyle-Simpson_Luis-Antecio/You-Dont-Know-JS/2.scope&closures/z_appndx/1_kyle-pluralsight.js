function foo() {
  var bar = 0;

  // ++ updates after setTimeout runs
  // the bar value is shared in the closure; the value is remembered
  setTimeout(function() {
    console.log(bar++); 
  }, 100);
  
  setTimeout(function() {
    console.log(bar++);
  }, 150);

  setTimeout(function() {
    console.log(bar++);
  }, 200);
}

foo();


/////

// var is function scoped, here it is global scoped so the loop runs and then setTimeout is executed
// to solve this use let or wrap the setTimeout in an IIFE, or set j = i and use j
for (var i = 0; i <= 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000)
}



/////

