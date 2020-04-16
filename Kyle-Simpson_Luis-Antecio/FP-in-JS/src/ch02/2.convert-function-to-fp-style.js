const R = require('ramda');
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

  // printPeople(people, inUs, print);


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
