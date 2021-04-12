const R = require('ramda');
const compose = R.compose;
const curry = R.curry;
const pipe = R.pipe;
const Person = require('../../model/Person.js').Person;

const p1 = new Person('1234', 'Alonzo', 'Xavier', '1983', 'USA');
const p2 = new Person('4567', 'Xabi', 'Xavier', '1984', 'Guam');
const p3 = new Person('8901', 'Predrag', 'Xavier', '1985', 'USA');

const people = [p1, p2, p3];

{// your usual function
  function printPeopleInTheUS(ppl) {
    for (let i = 0; i < ppl.length; i++) {
      let thisPerson = ppl[i];
      if (thisPerson.address === 'USA') {
        console.log(thisPerson);
      }
    }
  }
  // printPeopleInTheUS(people);
}

{// how can you break it into parts?
  function printPeople(ppl, action) {
    for (let i = 0; i < ppl.length; i++) {
      action(ppl[i]);
    }
  }
  function action(person) {
    if (person.address === 'USA') {
      console.log(person);
    }
  }
  // printPeople(people, action);
}

{ // taking full advantage of higher order functions
  function printPeople(ppl, selector, printer) {
    ppl.forEach(function(person) {
      if(selector(person)) {
        printer(person);
      }
    });
  }

  const inUs = person => person.address === 'USA';
  const print = console.log;

  // version 1
  printPeople(people, inUs, print); 

  // version 2 : 2 arguments
  const myOwnPrintPpl = (ppl, selector) => ppl.filter(selector);
  myOwnPrintPpl(people, inUs); //?
  
  // version 3: fn to fn
  const myOwnPrintPpl2 = (ppl) => (selector) => ppl.filter(selector);
  myOwnPrintPpl2(people)(inUs); //?

  // version 3 curry: my fave
  const curriedMyOwnPrintPpl = curry(myOwnPrintPpl);
  curriedMyOwnPrintPpl(people)(inUs); //?
  // because you can pipe or compose curried fns . Pointless here since there is 1 fn, but you get the idea
  compose(curriedMyOwnPrintPpl)(people)(inUs); //?
  compose(curriedMyOwnPrintPpl(people)(inUs)); //?


  // using lenses to access to access an object's properties

  const prop = 'address';
  const countryL = R.lensProp(prop); 
  R.view(countryL, p1); //?

  const inCountry = R.curry( (country, person) => 
    R.equals(R.view(countryL, person), country));
  
  inCountry('USA')(p1); //?

  people
    .filter(inCountry('Guam'))
    .map(console.log);
}
