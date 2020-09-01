// PRODUCER side -same 
var a = new LazyArray();
setInterval(function everySecond(){
  a.push(Math.random());
}, 1000);


// CONSUMER side

// filter, modeled over time
// a value from a only comes to b if it passes the isOdd predicate
var b = a.filter(function isOdd(v) {
  return v % 2 
});
b.listen(function onlyOdds(v) {
  console.log(v);
});

// reduce, modeled over time.
// Since we don’t specify an initialValue to the reduce(..) call, 
// neither the sum(..) reducer nor the runningTotal(..) event callback will be invoked 
// until at least two values have come through from a.
var c = a.reduce(function sum(total, v){
  return total + v;
});
c.listen(function runningTotal(v){
  console.log(v);
});
// This snippet implies that the reduction has a memory of sorts, 
// in that each time a future value comes in, the sum(..) reducer will be invoked 
// with whatever the previous total was as well as the new next value v.
