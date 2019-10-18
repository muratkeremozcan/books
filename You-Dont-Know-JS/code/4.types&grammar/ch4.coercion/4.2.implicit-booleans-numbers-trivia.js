// implicit vs explicit boolean - number example

// return true if only one item is true
function onlyOne() {
  var sum = 0;
  
  for (let i = 0; i < arguments.length; i++) {

    // implicit way
    // relying on the 1 for true/truthy coercions, and numerically adding them all up. 
      // sum += arguments[i] uses implicit coercion to make that happen.

    // if(arguments[i]) {
    //   sum += arguments[i];
    // }
    
    // explicit way
    // use !!arguments[i] to force the coercion of the value to true or false
    sum += Number (!!arguments[i]);
  }
  return sum == 1;
}

var a = true;
var b = false;

onlyOne(a,b); //?
onlyOne(b,a,b,b,b); //?
onlyOne(b,a,a,b,b); //?
