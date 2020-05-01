const Person = require('../../model/Person.js').Person;
const Address = require('../../model/Address.js').Address;
let address = new Address('US', 'NJ', 'Princeton', '08544', 'Alexander St.');
let otherAddress = new Address('Turkey', 'Aydin', 'IDU', '09955', 'Soke');
var p1 = new Person('111-11-1111', 'Haskell', 'Curry', 1900, address);
var p2 = new Person('333-33-3333', 'John', 'von Neumann', 1903, otherAddress);
var people = [p1, p2, null, undefined];
import _ from 'lodash';

// you can think of filter as select. Selects the array elements of a given condition.

const isValid = val => !_.isUndefined(val) && !_.isNull(val);
const fullName = person => `${person.firstname} ${person.lastname}`;

people
  .filter(isValid) 
  .map(fullName) //?

const bornIn1903 = person => person.birthYear === 1903;


people
  .filter(isValid)
  .filter(bornIn1903)
  .map(fullName) //?