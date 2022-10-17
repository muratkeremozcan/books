import * as R from 'ramda'

///// sort & sortBy
{
  // native sort mutates the array
  const nums = [3, 2, 4, 1]
  const numsR = [3, 2, 4, 1]
  const cb = (a, b) => a - b

  // ramda sort does not mutate the array, applies a function before comparison
  nums.sort(cb) //?
  R.sort(cb)(numsR) //?
  R.sortBy(Math.abs)(numsR) //?
  // sortBy applies a function to your values before comparing them. Sorting by absolute value, for example, is trivial now.

  nums //?
  numsR //?
}

///////// sortWith
{
  // sorWith can sort with multiple criteria (ex: name and then age)

  const people = [
    {
      name: 'Bobo',
      age: 25,
    },
    {
      name: 'Cam',
      age: 25,
    },
    {
      name: 'Al',
      age: 29,
    },
  ]

  R.sortWith([R.ascend(R.prop('age')), R.ascend(R.prop('name'))], people) //?

  R.sortWith([R.descend(R.prop('age')), R.descend(R.prop('name'))], people) //?
}

//// ascend and descend take a fn and apply it to each value
{
  const people = [
    {
      height: 23,
    },
    {
      height: 230,
    },
    {
      height: 2.3,
    },
  ]

  // const getHeight = x => x.height // same as R.prop('height')
  const getHeight2 = R.prop('height')
  const byHeight = R.ascend(getHeight2)

  R.sort(byHeight)(people) //?
  R.sort(R.descend(getHeight2))(people) //?
}

///// path lets you access nested properties
{
  const people = [
    {
      name: 'I am second',
      metadata: {
        attributes: {
          height: {
            value: 23,
          },
        },
      },
    },
    {
      name: 'I am last',
      metadata: {
        attributes: {
          height: {
            value: 230,
          },
        },
      },
    },
    {
      name: 'I am first',
      metadata: {
        attributes: {
          height: {
            value: 2.3,
          },
        },
      },
    },
  ]

  const height = R.path(['metadata', 'attributes', 'height', 'value']) //?
  height(people[0]) //?

  const sortByHeight = R.sortBy(height)
  sortByHeight(people) //?
}

////// comparator creates comparator functions out of regular functions that compare two elements\
// Ramda can turn any comparison function into a proper comparator. Just wrap the comparator function in R.comparator
{
  const people = [{height: 20}, {height: 10}]
  const byHeight = (a, b) => a.height > b.height

  R.sort(byHeight, people) //?
  R.sort(R.comparator(byHeight), people) //?
}
