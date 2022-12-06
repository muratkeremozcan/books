const addOne = (x) => x + 1;
const duplicate = (x) => x * 2;
const square = (x) => x * x;

const numbers = [1, 2, 3];

{
  // functional composition
  // with a single value
  const calculateValueOne = square(duplicate(addOne(1))); // ?

  // with arrays
  const calculateValues = numbers.map(addOne).map(duplicate).map(square); //?
}

{
  const pipe =
    (...functions) =>
    (args) => {
      return functions.reduce((acc, fn) => fn(acc), args);
    };

  const calculate = pipe(addOne, duplicate, square);
  // with single value
  const calculateValue = calculate(1); //?
  // with arrays
  const calculateValues = numbers.map(calculate); //?
}

// with lodash/fp
{
  const _ = require("lodash/fp");

  const calculatePipe = _.pipe(addOne, duplicate, square); //?
  const calculateValuePipe = calculatePipe(1); //?
  const calculateValuesPipe = _.map(calculatePipe, numbers); //?

  const calculate = _.compose(square, duplicate, addOne);
  const calculateValue = calculate(1); //?
  // lodash switches to data last style with compose
  const calculateValues = _.map(calculate, numbers); //?
}

// with ramda
{
  const R = require("ramda");

  const calculatePipe = R.pipe(addOne, duplicate, square);
  const calculateValuePipe = calculatePipe(1); //?
  const calculateValuesPipe = R.map(calculatePipe, numbers); //?

  const calculate = R.compose(square, duplicate, addOne);
  const calculateValue = calculate(1); //?
  const calculateValues = R.map(calculate, numbers); //?
}
