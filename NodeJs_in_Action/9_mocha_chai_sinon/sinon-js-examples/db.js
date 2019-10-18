const fs = require('fs');

class Database {
  constructor(filename) {
    this.filename = filename;
    this.data = {};
  }

  save(cb) { // cb callback gets called when writeFile is done
    fs.writeFile(this.filename, JSON.stringify(this.data), cb); // writeFile Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer https://nodejs.org/api/fs.html
  } // JSON.stringify converts a js object to JSON

  insert(key, value) {
    this.data[key] = value; // object's (json file's) key = value
  }
}
module.exports = Database;