const words = ["Marty", "Doc", "Einstein"];

{
  let longWords = [];
  for (let i of words) {
    if (i.length >= 5) {
      longWords.push(i);
    }
  }
  longWords; //?
}

// FP refactor
{
  // curred version of (num, word) => word.length >= num
  const largerThan = (num) => (word) => word.length >= num;
  const largerThanFive = largerThan(5);
  const longWords = words.filter(largerThanFive); //?
}

// with lodash curry
{
  const _ = require("lodash");

  const largerThan = _.curry((num, word) => word.length >= num);
  const largerThanFive = largerThan(5);
  const longWords = words.filter(largerThanFive); //?
}

// with ramda curry
{
  const R = require("ramda");

  const largerThan = R.curry((num, word) => word.length >= num);
  const largerThanFive = largerThan(5);
  const longWords = words.filter(largerThanFive); //?
}
