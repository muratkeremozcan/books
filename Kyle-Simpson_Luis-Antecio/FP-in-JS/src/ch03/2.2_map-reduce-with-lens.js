const Person = require('../../model/Person.js').Person;
const Address = require('../../model/Address.js').Address;
let address = new Address('US', 'NJ', 'Princeton', '08544', 'Alexander St.');
let otherAddress = new Address('Turkey', 'Aydin', 'IDU', '09955', 'Soke');
var p1 = new Person('111-11-1111', 'Haskell', 'Curry', 1900, address);
var p2 = new Person('222-22-2222', 'Barkley', 'Rosser', 1907, address);
var p3 = new Person('333-33-3333', 'John', 'von Neumann', 1903, otherAddress);
var p4 = new Person('444-44-4444', 'Alonzo', 'Church', 1903, otherAddress);
var people = [p1, p2, p3, p4];
import R from 'ramda';
import _ from 'lodash';

// Instead of direct property access, consider providing a lens

// using LensePath, you can create a lens that wraps over nested property of an object:
const cityPath = ['address', 'city'];
const cityLens = R.lensPath(cityPath); // R.lensPath([<property>, <sub.property>, ...])

// remember lenses
// R.view(<property>, <newObj>)
R.view(cityLens, p2); //?
R.equals(R.view(cityLens, p2), p1.address.city); //?
let newP = R.set(cityLens, 'Chicago', p2); // R.set(<property>, <value>, <sourceObj>)
R.view(cityLens, newP); //?


// just the same way we did with map & reduce, lenses could be used to calculate data
// either way does not mutate data, but this is to show with lenses the same ops are possible

const statReducer = (stat, address) => {
  stat[address] = _.isUndefined(stat[address]) ? 1 : stat[address] + 1;
  return stat;
}
// we did it as such without a lense
const getCity = person => person.address.city;
// remember the non-lense version
people.map(getCity); //? 
// lense version is the same
people.map(R.view(cityLens)); //?


people
  .map(R.view(cityLens))
  .reduce(statReducer, {}) //?

// side note
_.groupBy(people, R.view(cityLens)); //?