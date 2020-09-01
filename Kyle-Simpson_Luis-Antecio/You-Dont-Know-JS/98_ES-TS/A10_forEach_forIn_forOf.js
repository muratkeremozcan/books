// forEach problem: does not iterate through properties, does not allow to break the loop prematurely 
let numbersArray = [5, 6, 7, 8];
numbersArray.description = 'four numbers';
numbersArray// ? 

// prints 1, 2, 3, 4, ignores the property (description), does not allow to break the loop prematurely
numbersArray.forEach( n => console.log(n) );

////////////
// for-in iterates properties/keys, allows use of break (unlike forEach)
for (let n in numbersArray) {
  console.log(n); // properties
  console.log(numbersArray[n]); // values
}
for (let n in numbersArray) {
  if (n > 2) break;
  console.log(n); // properties
  console.log(numbersArray[n]); // can also get values
  
}

///////////
// for-of (new in ES6): iterates values, allows break (unlike forEach) . Does not iterate through properties
for (let n of numbersArray) {
  console.log(n);
}
// allows the use of break; keyword
for (let n of numbersArray) {
  if (n > 7) break;
  console.log(n);
}


var arr = [3, 5, 7];
arr.foo = "hello";

for (var i in arr) {
   console.log(i); // logs "0", "1", "2", "foo"
   console.log(arr[i]);
}

for (var i of arr) {
   console.log(i); // logs "3", "5", "7"
  //  you don’t have to worry about adding new properties to objects. The for...of loop will only loop over the values in the object.
    //it is does not log "3", "5", "7","hello"
}