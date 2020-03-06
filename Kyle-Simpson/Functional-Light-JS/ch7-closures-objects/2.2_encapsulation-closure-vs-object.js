
// the distinction: relationship: a closure associates a single function with a set of state, 
// whereas an object holding the same state can have any number of functions to operate on that state.

// we can expose multiple methods with a single closure as the interface
var person = {
  firstName: 'Kyle',
  lastName: 'Simpson',
  first() {
    return this.firstName
  },
  last() {
    return this.lastName
  }
}
person.first() + ' ' + person.last(); //?



// we can represent this using a closure without objects; looks different but same behavior
function createPerson(firstName, lastName) {
  return API;

  function API(methodName) {
    switch (methodName) {
      case 'first':
        return first();
      case 'last':
        return last();
    }
  }

  function first() {
    return firstName;
  }

  function last() {
    return lastName;
  }
}

var persona = createPerson('Murat', 'Ozcan');
persona('first') + ' ' + persona('last'); //?