const Person = require('../../model/Person.js').Person;
const p1 = new Person('1234', 'Alonzo', 'Xavier', '1983', 'USA');
const p2 = new Person('4567', 'Xabi', 'Xavier', '1984', 'Guam');
const p3 = new Person('8901', 'Predrag', 'Xavier', '1985', 'USA');
const p4 = new Person('1011', 'Murat', 'Ozcan', '1983', 'Turkey');
const people = [p1, p2, p3, p4];
import _ from 'lodash';


// given a list of student objects, you want to extract each person’s full name.

{ // imperative approach
  var result = [];
  for (let i = 0; i < people.length; i++) {
    let p = people[i];
    if (p !== null && p !== undefined) {
      result.push(p.fullname);
    }
  }
  // result; //?
}


// map with function chain
people.map(p =>
  (p !== null && p !== undefined) ? p.fullname : ''
); //?

// better: using filter eliminates the conditional
people
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname); //?


// with _map
_.map(people, p => (p !== null && p !== undefined) ? p.fullname : ''); //?

// using filter eliminates the conditional
_.filter(people, p => p !== null && p !== undefined)
  .map(p => p.fullname) //?



// Array.reverse

people
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .reverse(); //?

_.map(people, p => (p !== null && p !== undefined) ? p.fullname : '')
  .reverse() //?

_.filter(people, p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .reverse() //?


// lodash provides a way to manage objects, wrap them in _(object) notation. 
// Need to end with .value()


_(people)
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .value(); //?

_(people)
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .reverse()
  .value(); //?


// better: start with _.chain

_.chain(people)
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .value(); //?

_.chain(people)
  .filter(p => p !== null && p !== undefined)
  .map(p => p.fullname)
  .reverse() // reverse can be anywhere in the chain
  .value(); //?
