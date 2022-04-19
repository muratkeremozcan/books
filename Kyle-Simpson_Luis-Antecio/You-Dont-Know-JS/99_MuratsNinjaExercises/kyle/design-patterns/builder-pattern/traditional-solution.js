const { ifElse } = require("ramda");

class Address {
  constructor(zip, street) {
    this.zip = zip;
    this.street = street;
  }
}

class User {
  constructor(name, age, phone, address) {
    this.name = name;
    this.age = age;
    this.phone = phone;
    this.address = address;
  }
}

// the problem: we have to pass null/undefined for properties we do not care about
const user = new User("Bob", undefined, null, new Address("12345", "Main St"));

user /*?.*/;
user; /*?+*/

// traditional solution: create a builder class that sets properties and returns the object
class UserBuilder {
  // (1) use the first arg to create the base object
  constructor(name) {
    this.user = new User(name);
  }

  // (2) create methods to set the properties, and return the object
  setAge(age) {
    this.user.age = age;
    return this;
  }

  setPhone(phone) {
    this.user.phone = phone;
    return this;
  }

  setAddress(address) {
    this.user.address = address;
    return this;
  }

  // (3) have a build method to wrap things up
  // return the object (this.user) vs the builder class (this)
  build() {
    return this.user;
  }
}

const traditionalBuilder = new UserBuilder("Bob");
// (4) invoke the methods for the args you need, no need to pass undefined
const traditionalUser = traditionalBuilder
  .setAddress(new Address("12345", "Main St."))
  .build();

traditionalUser; /*?+*/
