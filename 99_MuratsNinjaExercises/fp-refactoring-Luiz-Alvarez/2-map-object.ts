import _ from 'lodash'
import R from 'ramda'

type Traveler = {
  name: string
  age: number
  car: string
}
const travelerData: Traveler = {
  name: 'Marty',
  age: 17,
  car: 'Toyota SR5',
}

// map to an array of just the values

{
  const flatArray = []
  const travelerArray = Object.entries(travelerData)

  for (let i of travelerArray) {
    flatArray.push(i[1])
  }

  flatArray //?
}

// fp refactor
{
  const travelerArray = Object.entries(travelerData)
  const extractValue = ([, value]: [string, string | number]) => value
  const flatArray = travelerArray.map(extractValue)
  flatArray //?
}

// lodash version
// lodash can map over objects; no need to covert object to array with Object.entries
// the callback is also simpler but mind the arg flip: (value, key)
// data.map(cb) vs _.map(data, cb)
{
  const extractValue = (value: string | number) => value
  const flatArray = _.map(travelerData, extractValue)
  flatArray //?
}

// ramda version
// with ramda, we would transform the object to an array with R.toPairs
// the extractValue cb is the same as the original
// data.map(cb) vs _.map(data, cb) vs R.map(cb, data) - with Ramda data is last and is curried
// version 2 is nicer to read with pipe
{
  const extractValue = ([, value]: [string, string | number]) => value

  const flatArray = R.map(extractValue, R.toPairs(travelerData))
  flatArray //?

  // version 2
  const transform = R.pipe(R.toPairs, R.map(extractValue))
  transform(travelerData) //?
}
