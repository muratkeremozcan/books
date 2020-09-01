const Person = require('../../model/Person.js').Person;
const p1 = new Person('1234', 'Alonzo', 'Xavier', '1983', 'USA');
const p2 = new Person('4567', 'Xabi', 'Xavier', '1984', 'Guam');
const p3 = new Person('8901', 'Predrag', 'Xavier', '1985', 'USA');
const p4 = new Person('1011', 'Murat', 'Ozcan', '1983', 'Turkey');
const people = [p1, p2, p3, p4];
import _ from 'lodash';


// reduce: each iteration returns an accumulated value based on the previous result; 
// this accumulated value is kept until you reach the end of the array. 
// The final outcome of reduce is always a single value.


// find the number of people who live in a particular country

// reducerFn(accumulator, current)
const addressReducer = (stat, person) => {
  const address = person.address;
  stat[address] = _.isUndefined(stat[address]) ? 1 : stat[address] + 1;
  return stat;
}

// reduce(reducerFn(accumulator, current), initialValue) 
people.reduce(addressReducer, {}); //?


/// broken down further

const getCountry = person => person.address;
people.map(person => getCountry(person)); //?

// acc, current
/** creates an object with address counts */
const statReducer = (stat, address) => {
  stat[address] = _.isUndefined(stat[address]) ? 1 : stat[address] + 1;
  return stat;
}
statReducer({}, 'USA'); //?
statReducer({USA: 1}, 'Guam'); //?
['USA', 'GUAM', 'USA', 'Turkey'].reduce(statReducer, {}); //?

people
  .map(getCountry)
  .reduce(statReducer, {}); //?

_(people)
  .map(getCountry)
  .value() //?

_.chain(people)
  .map(getCountry)
  .reduce(statReducer, {})
  .value() //?