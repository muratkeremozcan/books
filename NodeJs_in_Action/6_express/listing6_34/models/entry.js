'use strict';
const redis = require('redis');
const db = redis.createClient();

class Entry { // saves data in a redis list
  constructor(obj) { // the Entry class accepts an object, merges this object's properties into its own
    for (let key in obj) { // iterates over the keys in the object passed
      this[key] = obj[key]; // set each property, merges (key: value)
    }
  }

  static getRange(from, to, cb) { // retrieves post entries
    db.lrange('entries', from, to, (err, items) => { // redis lrange function used to retrieve entries
      if (err) return cb(err);
      let entries = [];
      items.forEach((item) => {
        entries.push(JSON.parse(item)); // you can parse the JSON data and convert it to an object, then push it into an array
      });
      cb(null, entries);
    });
  }

  save(cb) {
    const entryJSON = JSON.stringify(this); // converts saved entry data to JSON string. To convert js object to JSON, you can use JSON.stringify(obj)
    db.lpush('entries', entryJSON, (err) => { // lpush function is used to save JSON string to redis list
        if (err) return cb(err);
        cb();
      }
    );
  }

  static count(cb) {
    db.llen('entries', cb); // llen function to count entries
  }
}

module.exports = Entry;
