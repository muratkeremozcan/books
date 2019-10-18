'use strict';
const db = [];

exports.save = (doc) => {
  db.push(doc); // adds the doc to the db array
};

exports.first = (obj) => {
  return db.filter((doc) => { // selects docs that match every property in object
    for (let key in obj) {
      if (doc[key] != obj[key]) { // if it's not a match, return false and do not select this doc
        return false;
      }
    }
    console.log(db);
    console.log(doc);
    console.log(obj);
    return true; // if they all match, return true
  }).shift(); // get only the first doc, or null
};

exports.clear = () => {
  db.length = 0;
};

// Original version in listing 10.10:
exports.saveSync = (doc, cb) => {
  db.push(doc);
};

// Later version for testing asynchronous logic
exports.save = (doc, cb) => { // a callback is optionally provided that will execute after a small delay (meant to simulate async operations)
  db.push(doc);
  if (cb) {
    setTimeout(() => {
      cb();
    }, 1000);
  }
};
