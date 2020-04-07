// Symbol.iterator represents the special location (property) on any object 
// where the language mechanisms automatically look to find a method that will construct an iterator instance for consuming that object’s values.
// We can define our own; defining behavior that other parts of JS use 

var arr = [4, 5, 6, 7, 8, 9];

for (var v of arr){
  console.log(v);
}

// define our own iterator that only produces values from odd indexes
// generator with do while
arr[Symbol.iterator] = function*(){
  var idx = 1;
  do{
    yield this[idx];
  } while ( (idx +=2) < this.length );
};

for (var v of arr) {
  console.log(v);
}
