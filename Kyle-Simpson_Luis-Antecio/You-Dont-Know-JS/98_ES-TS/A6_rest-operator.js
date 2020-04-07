// rest operator: turns a variable number of parameters into an array

// rest operator   ... ===
// spread operator     === ...

// imagine that we need to write a function to calculate taxes that must be invoked 
// with the first argument, income, followed by any number of arguments representing the names of the customers. 

// ES5 arguments object

function calcTaxES5() {
  console.log('ES5. Calculating tax for customers with the income: ',
    arguments[0]); // first element
  
  // slice method can be called to convert Array-like objects / collections to a new Array.
  var customers = [].slice.call(arguments, 1);
  customers //?

  // Example of array.slice.call:
  function list() {
    return Array.prototype.slice.call(arguments);
  }
  
  var list1 = list(1, 2, 3); //? [1, 2, 3]

  customers.forEach( function (customer) {
    console.log('Processing ', customer);
  })
}
calcTaxES5(50000, 'Smith', 'Johnson', 'McDonald');

// with rest operator we can state that the arguments passed in will be treated as 'array-like'
  // this way we do not have to convert array-like objects to a new array
function calcTaxES6(income, ...customers) {
  console.log(`ES6. Calculating tax for customers with the income ${income} `);

  customers.forEach( customer => { // multi-line for it to work with Quokka
    console.log('Processing ', customer);
  });
}
calcTaxES6(50000, 'Smith', 'Johnson', 'McDonald');

// Because the arguments object isn’t a real array, we had to create an array in the ES5 version by using the slice () and call() methods 
// to extract the names of customers starting from the second element in arguments. 
// The ES6 version doesn’t require us to use these tricks because the rest operator gives us a regular array of customers. 
// Using the rest arguments made the code simpler and more readable.