// proxy helps control access to the object by using the traps (get and set) and helps define custom actions
// used for:
// logging  -> THIS EXAMPLE
// performance measurements
// data validation
// auto-populating object properties

function makeLoggable(target) { // takes a target object and makes it loggable
  return new Proxy(target, {
    get: (target, property) => { // a get trap that logs property reads
      console.log('reading ' + property);
      return target[property];
    },
    set: (target, property, value) => { // a set trap that logs property writes
      console.log('writing value ' + value + ' to ' + property);
      target[property] = value;
    }
  });
}

let ninja = { name: "Yoshi" }; // an object to serve as the TARGET OBJECT of the proxy to make things loggable
ninja = makeLoggable(ninja); // the object gets used as a target for a newly created proxy. Then, assign proxy to the ninja object, overriding it

console.log(ninja.name); // target.property

ninja.weapon = "katana";
console.log(ninja.weapon);