const _ = require('lodash');
const R = require('ramda');

const Person = require('../../model/Person.js').Person;
const Address = require('../../model/Address.js').Address;
var p1 = new Person('111-11-1111', 'Haskell', 'Curry', 1900, new Address('US'));
var p2 = new Person('222-22-2222', 'Barkley', 'Rosser', 1907, new Address('Greece'));
var p3 = new Person('333-33-3333', 'John', 'von Neumann', 1903, new Address('Hungary'));
var p4 = new Person('444-44-4444', 'Alonzo', 'Church', 1903, new Address('US'));
var p5 = new Person('555-55-5555', 'David', 'Hilbert',1910, new Address('Germany')); 
var people = [p1, p2, p3, p4, p5];
var p6 = new Person('666-66-6666', 'Alan', 'Turing', 1912, new Address('England'));
people.push(p6);

var p7 = new Person('777-77-7777', 'Stephen', 'Kleene', 1909, new Address('US'));
people.push(p7);



const isValid = val => !_.isUndefined(val) && !_.isNull(val);
const getCountry = person => person.address.country;

/** creates an object with country count */
const statReducer = function (stat, country) {
  if (!isValid(stat[country])) {
    stat[country] = { 'name': country, 'count': 0 };
  }
  stat[country].count++;
  return stat;
};


people
  .map(getCountry)
  .reduce(statReducer, {}); //?

// build a program that returns the country with the largest number of people in this dataset.


// The _.chain function can be used to augment the state of an input object 
// by connecting operations that transform the input into the desired output. 
// It’s powerful because, unlike wrapping arrays with the shorthand _(...) object, 
// it explicitly makes any function in the sequence chainable.

// Another benefit of using _.chain is that you can create complex programs that behave lazily,
// so nothing executes until that last value() function is called.


// _(people) // won't work
_.chain(people)
  .filter(isValid)
  .map(_.property('address.country')) // extracts person.address.country, like R.view
  .reduce(statReducer, {})
  .values()
  .sortBy('count')
  .reverse()  
  .first() 
  .value() //? 
  .name 

 // the chain executes only when value() is called 



 // extra: sql like lodash
 _.mixin({
  'select': _.map,
  'from': _.chain,
  'where': _.filter
});

_.from(people)
  .where(p => p.birthYear > 1900 && p.address.country !== 'US')
  .sortBy(['_firstname'])
  .select(rec => rec.firstname)
  .value(); 