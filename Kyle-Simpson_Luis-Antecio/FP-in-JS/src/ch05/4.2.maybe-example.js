// https://folktale.origamitower.com/api/v2.3.0/en/folktale.maybe.html
// https://oliverjash.me/2017/04/10/why-use-a-maybe-type-in-javascript
const Maybe = require('folktale/maybe');


{ // JS allows you to use nullable values in strings, and you won't get a runtime error
  const users = { 1: 'Bob', 2: 'Saffron' };
  
  const loggedInUserName = users[5];
  
  `Hello, ${loggedInUserName}`; //?
}

// THE PROBLEM: undefined/null bugs
// we can have null/undefined values in JS, but they can cause problems in runtime
{
const users = [
  { id: 1, name: 'Bob' },
  { id: 2, name: 'Saffron' }
];

const loggedInUser5 = users.find(user => user.id === 5 ); //?
const loggedInUser2 = users.find(user => user.id === 2 ); //?

// `Hello, ${loggedInUser5.name}`; // Cannot read property 'name'  , toggle to break things


// The Maybe Solution:
// If we used a Maybe type, it wouldn’t be possible to write these bugs. This is because you’re forced to:
// * map over the Maybe to use the inner value
// * provide a default when finally reading the inner value with getOrElse.
// Using this abstraction, this whole class of bugs (unexpected undefined/nulls) can be eradicated from our programs.

const maybeLoggedInUser5 = Maybe.fromNullable(loggedInUser5); //?
const message5 = maybeLoggedInUser5.map(loggedInUser => `Hello, ${loggedInUser.name}`)
                                   .getOrElse(''); //?

const maybeLoggedInUser2 = Maybe.fromNullable(loggedInUser2); //?
const message2 = maybeLoggedInUser2.map(loggedInUser => `Hello, ${loggedInUser.name}`)
                                   .getOrElse(''); //?
}



// THE PROBLEM: boolean coercion bugs
// In JS, we can use a value of any type in conditionals; JS converts coerces the value.
{
const users = { Bob: 0, Saffron: 10 };
const getAge = name => {
  const age = users[name];
  
  const message = age
    ? `${name} is ${age}`
    : 'No age';

  return message;
}

getAge('Saffron'); //?
getAge('Luke'); //?
// problem: Bob is 0, but it gets coerced to Falsy!
getAge('Bob'); //?
}

// To fix this, we must make our condition explicit, instead of relying on JavaScript’s boolean coercion:
{
const users = { Bob: 0, Saffron: 10 };

const getAge = name => {
  const age = users[name];
  
  const message = age !== undefined
    ? `${name} is ${age}`
    : 'No age';

  return message;
}

getAge('Saffron'); //?
getAge('Luke'); //?
// corrected with explicit checking
getAge('Bob'); //?

// but the problem is chain calculations getting noisy, requires diligence and prone to error

const getNextAge = name => {
  const age = users[name];

  const nextAge = age !== undefined
    ? age + 1
    : undefined;

  const message = nextAge !== undefined
    ? `${name}’s next age is ${nextAge}`
    : 'No age';

  return message;
}

getNextAge('Saffron'); //?
getNextAge('Bob'); //?
getNextAge('Luke'); //?


// The Maybe Solution:
// If we want to avoid boolean coercion bugs in our code without having to require discipline or extra verbosity, we can use a Maybe type.
// With Maybe, we never have to write a condition to check if a value exists or not, we can no longer write boolean coercion errors into our program.

const maybeGetNextAge = name => {
  const age = Maybe.fromNullable(users[name]);

  const message = age
        .map(age => age + 1)
        .map(nextAge => `${name}’s next age is ${nextAge}`)
        .getOrElse('No age');

  return message;
}

maybeGetNextAge('Saffron'); //?
maybeGetNextAge('Bob'); //?
maybeGetNextAge('Luke'); //?


}
