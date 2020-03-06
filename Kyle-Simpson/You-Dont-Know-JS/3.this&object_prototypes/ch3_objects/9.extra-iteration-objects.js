// for in : returns the indices/keys, the values are accessed with [i]

const obj = {
  id: 1,
  name: 'gowtham',
  active: true
};

for (let key in obj) {
  // hasOwnProperty is used to make sure that property belongs to the obj
    // !! for in iterates over the object prototype chain
  if (obj.hasOwnProperty(key)) { 
    console.log(`${key}: ${obj[key]}`);
  }
  // we don't really need hasOwnProperty conditional, but it's best practice
  console.log(`${key}: ${obj[key]}`);
}


// all these convert the object into something array like, so that array methods can be used on the result
///////////

///////////
// Object.entries(): takes the obj and really converts it into an array of arrays, with [key, value] pairs as elements
Object.entries(obj); //?
Object.entries(obj).forEach( ([key, value]) => {
  console.log(`${key}: ${value}`)
});


// Object.keys(): takes the obj and returns an array of all enumerable properties, 
Object.keys(obj); //?
Object.keys(obj).forEach(key => {
  console.log(`${key}: ${obj[key]}`);
});
// contrast note: Object.getOwnPropertyNames(..) returns an array of all properties, enumerable or not.
  // prefer Object.keys when working with arrays, prefer Object.getOwnPropertyNames when you want all properties
Object.getOwnPropertyNames(obj); //?


///////////
// Object.values(): takes the obj and returns an array of all values
Object.values(obj); //?
Object.values(obj).forEach(value => {
  console.log(`${value}`);
});


