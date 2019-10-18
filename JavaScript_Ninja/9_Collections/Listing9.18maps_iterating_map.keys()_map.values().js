const directory = new Map(); // phone directory to store each ninja's phone number

directory.set("Yoshi", "+81 26 6462"); 
directory.set("Kuma", "+81 52 2378 6462"); // map.set(key, {value})
directory.set("Hiro", "+81 76 277 46");
console.log(directory);

for (let item of directory){ // iterate though each key-value pair in the map
  console.log(item); // each iteration gives a two-item array: [key, value]
}

console.log(directory.keys()); // MAP.KEYS()

for (let key of directory.keys()){ // iterate through keys
  console.log(key);
  console.log(directory.get(key)); // you can get the value of each key
  console.log(directory.has(key)); // you can get the value of each key
}

console.log(directory.values()); // MAP.VALUES
for (let value of directory.values()){ // iterate through values
  console.log(value);
  console.log(directory.get(value)); // no such thing as getting the key from the value
  console.log(directory.has(value)); // no such thing as getting the key from the value
}
