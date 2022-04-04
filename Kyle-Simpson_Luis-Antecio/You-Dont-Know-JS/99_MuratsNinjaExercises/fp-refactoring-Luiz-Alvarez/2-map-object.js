const travelerData = {
  name: "Marty",
  age: 17,
  car: "Toyota SR5",
};

// map to an array of just the values

{
  const flatArray = [];
  const travelerArray = Object.entries(travelerData);

  for (let i of travelerArray) {
    flatArray.push(i[1]);
  }

  flatArray; //?
}

// fp refactor
{
  const travelerArray = Object.entries(travelerData);
  const extractValue = ([key, value]) => value;
  const flatArray = travelerArray.map(extractValue); //?
}

// lodash version
{
  const _ = require("lodash");

  // lodash can map over objects, but mind the arg flip
  const flatArray = _.map(travelerData, (value, key) => value); //?
}
