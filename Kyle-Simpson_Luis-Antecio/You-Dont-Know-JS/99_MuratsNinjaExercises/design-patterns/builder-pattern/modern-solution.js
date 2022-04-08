// https://www.youtube.com/watch?v=M7Xi1yO_s8E

class Address {
  constructor(zip, street) {
    this.zip = zip;
    this.street = street;
  }
}

// modern solution:
// (1) put all the optional arguments in an object with a default value of an empty object
// this is so that when the args are not passed, they are just undefined
// (2) as an additional benefit of the modern solution, we can have default values for any of the args
class User {
  constructor(name, { age, phone = "123-456-7890", address } = {}) {
    this.name = name;
    this.age = age;
    this.phone = phone;
    this.address = address;
  }
}

const user = new User("Bob");
user; /*?+*/

const user2 = new User("Bob", { address: new Address("12345", "Main St") });
user2 /*?+*/;
