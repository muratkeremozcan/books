'use strict';

const redis = require('redis');
const bcrypt = require('bcrypt-nodejs'); // bycrypt is a salted hashing function for hashing passwords. Salting helps protect against rainbow table attacks (pre-computed tables to break hashed passwords)
const db = redis.createClient(); // open Redis connection

class User {
  constructor(obj) { // the user class accepts an object, merges this object's properties into its own
    for (let key in obj) { // iterate over the passed in object
      this[key] = obj[key]; // set each property (key: value) .  ex: new User({name: 'tobi'})
    }
  }

  save(cb) {
    if (this.id) { // check if the user has an id
      this.update(cb); // if so then invoke the update method. Index the user ID by name and populate a Redis hash with the object's properties
    } else { // if no id, then it's a new user
      db.incr('user:ids', (err, id) => { // the user:ids value is incremented (creating unique id)
        if (err) return cb(err);
        this.id = id; // set the id, so it will be saved
        this.hashPassword((err) => {  // the password is hashed
          if (err) return cb(err);
          this.update(cb); // save the user properties
        });
      });
    }
  }

  update(cb) {
    const id = this.id;
    db.set(`user:id:${this.name}`, id, (err) => { // index users by name
      if (err) return cb(err);
      db.hmset(`user:${id}`, this, (err) => { // use Redis to store the current class' properties
        cb(err);
      });
    });
  }

  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => { // generate a 12 character salt for the hash with genSalt
      if (err) return cb(err);
      this.salt = salt; // set salt so it will be saved
      bcrypt.hash(this.pass, salt, null, (err, hash) => { // generate hash
        if (err) return cb(err);
        this.pass = hash; // set hash so it'll be saved by update
        cb();
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    };
  }

  static getByName(name, cb) {  //once the login form is submitted, need a method for fetching the user via name. 
    User.getId(name, (err, id) => { // perform id lookup
      if (err) return cb(err);
      User.get(id, cb); // grab user by id
    });
  }

  static getId(name, cb) {
    db.get(`user:id:${name}`, cb); // gets id indexed by name
  }

  static get(id, cb) { // 
    db.hgetall(`user:${id}`, (err, user) => { // fetches plain object hash
      if (err) return cb(err);
      cb(null, new User(user)); // converts plain object to a new user object
    });
  }

  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => { // look up user by name
      if (err) return cb(err);
      if (!user.id) return cb(); // if user doesn't exist. When looking up a key that doesn't exist, Redis will give you an empty hash, which is why we check for !user.id instead of !user
      bcrypt.hash(pass, user.salt, null, (err, hash) => { // hash the password
        if (err) return cb(err);
        if (hash == user.pass) return cb(null, user); // if match is found return early
        cb(); // if the user isn't found, the callback function is immediately invoked
      });
    });
  }
}

module.exports = User;
