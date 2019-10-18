// proxy helps control access to the object by using the traps (get and set) and helps define custom actions
// used for:
// logging
// performance measurements
// data validation -> THIS EXAMPLE
// auto-populating object properties (avoiding null exceptions)
// negative array indexes
const emperor = { name: "Komei"}; // this will be the target object
const representative = new Proxy(emperor, { // proxy constructor takes in the object it's the proxy for (emperor: TARGET OBJECT)
  get: (target, key) => { // get trap, for reading the object. If the target object has the property, return the property, if not return a message
    console.log('Reading ' + key + ' through a proxy');
    return key in target ? target[key] : "Don't bother the emperor!"; // target.key exists? if not don't bother
    // if (key in target) {
    //   return target[key];
    // } else {
    //   "Don't bother the emperor";
    // }
  },
  set: (target, key, value) => { // set trap, for writing to the object
    console.log('Writing ' + key + ' through a proxy');
    target[key] = value;
  }
});

// a get trap is implicitly called when we read, a set trap implicitly called when we write to a property
// IMPORTANT, we don't call functions() we call properties

console.log(emperor.name); // target.key = Komei , regular access
console.log(representative.name); // target.key = Komei. Proxy access. We can get a property through proxy

console.log(emperor.nickname); // accessing a non-existing property returns undefined
console.log(representative.nickname); // the proxy jumps in when we make an invalid request

representative.nickname = "Tenno"; // target.key = "Tenno" . Adds a property through the proxy. The property is accessible universally
console.log(emperor.nickname); // undefined
console.log(representative.nickname); // the proxy jumps in when we make an invalid request

