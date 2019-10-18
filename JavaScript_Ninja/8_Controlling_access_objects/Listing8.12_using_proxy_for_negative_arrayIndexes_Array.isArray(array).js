// proxy helps control access to the object by using the traps (get and set) and helps define custom actions
// used for:
// logging
// performance measurements
// data validation
// auto-populating object properties
// negative array indexes THIS EXAMPLE

function createNegativeArrayProxy(array) {
  if (!Array.isArray(array)) { // if the target object isn't an array, throw an exception
    throw new TypeError('we expected an array, but no array');
  }
  return new Proxy(array, { // returns a new proxy that that takes in the array and uses it as a proxy target
    get: (target, index) => { // get trap activated whenever an array is read
      index = +index; // turns the property into a number with the unary plus operator
      return target[index < 0 ? target.length + index : index]; // if the index is negative, access it from the back, else normal
    },
    set: (target, index, val) => { // set trap activated whenever th an array index is written to
      index = +index;
      return target[index < 0 ? target.length + index : index] = val;
    }
  });
}

const ninjas = ["Yoshi", "Kuma", "Hattori"]; // standard array
const proxiedNinjas = createNegativeArrayProxy(ninjas); // pass into the function that will create a proxy to that array
// GET
console.log(ninjas[0], ninjas[1], ninjas[2]); // normal access to array items
console.log(proxiedNinjas[0], proxiedNinjas[1], proxiedNinjas[2]); // positive array access through proxy

console.log(ninjas[-1], ninjas[-2], ninjas[-3]); // cannot access negative array normally
console.log(proxiedNinjas[-1], proxiedNinjas[-2], proxiedNinjas[-3]); // negative array access

//SET
proxiedNinjas[-1] = "Hachi"; // we can also modify array items from the back, only if we go through the proxy
console.log(ninjas);
console.log(proxiedNinjas[2]);
console.log(proxiedNinjas[-1]);

// 8.13
function measure(items) {
  const startTime = new Date().getTime(); // get the current time before running the operation
  for (let i = 0; i < 500000; i++) { // access the items in the collection in a long running loop
    items[0] === "Yoshi";
    items[1] === "Kuma";
    items[2] === "Hattori";
  }
  return new Date().getTime() - startTime; // measure the time it took to execute
}

console.log(Math.round(measure(proxiedNinjas)/measure(ninjas)), ' times slower');