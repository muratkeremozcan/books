const evilGuys = [
  ["buford", "The guy from 1885"],
  ["biff", "The guy from 1955, 1985 and 2015"],
  ["griff", "The guy from 2015"],
];

{
  let evilObject = {};

  for (let evilGuy of evilGuys) {
    const [name, description] = evilGuy;
    evilObject[name] = description;
  }
  evilObject; //?
}

// fp refactor
{
  /** reducer = (acc, curr) => ... */
  const reducer = (acc, [key, value]) => {
    // acc // {}, 1st, 1st + 2nd ...
    // key // buford, biff, griff
    // value // The guy from 1885, The guy from 1955, 1985 and 2015, The guy from 2015

    return { ...acc, [key]: value };
  };
  const evilObject = evilGuys.reduce(reducer, {}); //?
}

// with lodash
{
  const _ = require("lodash");

  const reducer = (acc, [key, value]) => ({ ...acc, [key]: value });
  const evilObject = _.reduce(evilGuys, reducer, {}); //?
}

// with ramda (prefer data at the end)
{
  const R = require("ramda");

  const reducer = (acc, [key, value]) => ({ ...acc, [key]: value });
  const evilObject = R.reduce(reducer, {}, evilGuys); //?
}
