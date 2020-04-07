// Eager: an operation that will happen right away
// Lazy: an operation will progress over time


// PRODUCER side 
// this abstract array acts like a stream of values
// It assumes that values will come one at a time, over time
// Imagine it more like a buffer than an array because we do not need to keep values in it once they have been handled
var a = new LazyArray();

// we are pushing a random value to the LazyArray every second (imagine it could be a mouse click, keystrokes, message from server...)
setInterval(function everySecond(){
  a.push(Math.random());
}, 1000);


// CONSUMER SIDE 
// think of each value arriving as an event
// The map(..) operation then triggers a corresponding event on b, which we listen(..) to so we can consume the new value.
var b = a.map(function double(v) {
  return v * 2;
});
// we need is to be able to listen to b to be notified when new values are made available.
b.listen(function onValue(v) {
  console.log(v);
});

// just as promises abstract time away from our concern for a single asynchronous operation, 
// reactive FP abstracts (separates) time away from a series of values/ operations.


////////////////
// Imperative version of the code (not recommended)

// Producer
/** every second, a.onValue is called , which in turn calls b.onValue */
var a = {
  onValue(v) { 
    // in the former snippet b pulls from a with b = a.map, declaring b's values are sourced from a, 
    // in this snippet a pushes into b; not good, because it violates separation of concerns. Also hard to read what v is.
    b.onValue(v); 
  }
}
setInterval(function everySecond() {
  a.onValue(Math.random());
}, 1000)


// Consumer
var b = {
  map(v) {
    return v * 2;
  },
  onValue(v) {
    v = this.map(v);
    console.log(v);
  }
}