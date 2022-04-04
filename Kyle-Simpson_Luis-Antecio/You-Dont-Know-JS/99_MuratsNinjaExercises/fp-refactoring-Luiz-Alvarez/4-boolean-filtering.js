const allValues = [true, true, false, true, false];

{
  let trueValues = [];
  for (let i of allValues) {
    if (i) {
      trueValues.push(i);
    }
  }
  trueValues; //?
}

// fp refactor
{
  const trueValues = allValues.filter(Boolean); //?
}

// lodash version
{
  const _ = require("lodash");

  const trueValues = _.filter(allValues, Boolean); //?
}

// ramda version (prefer data at the end)
{
  const R = require("ramda");

  const trueValues = R.filter(Boolean, allValues); //?
}
