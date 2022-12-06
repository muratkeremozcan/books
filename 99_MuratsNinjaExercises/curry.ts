const _ = require("lodash");
const R = require("ramda");

const fruits = ["apple", "banana", "orange", "watermelon"];

fruits.filter((name: string) => name.startsWith("a")); //?

const startsWith = (letter: string, name: string) => name.startsWith(letter);

fruits.filter(startsWith.bind(null, "a")); //?
fruits.filter((name) => startsWith("a", name)); //?
// startsWith has 2 params, filter needs 1
// so curry it
const startsWithCurr = (letter: string) => (name: string) =>
  name.startsWith(letter);

fruits.filter(startsWithCurr("a")); //?

////////

const startsWithCurr_ = _.curry((letter: string, name: string) =>
  name.startsWith(letter)
);

fruits.filter(startsWithCurr_("a")); //?

const startsWithCurrR = R.curry((letter: string, name: string) =>
  name.startsWith(letter)
);

fruits.filter(startsWithCurrR("a")); //?
