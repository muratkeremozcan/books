import {reduce, ifElse, pipe, prop} from 'ramda'

// exercise 17: find largest rating
const ratings = [2, 3, 1, 4, 5]

// get the largest rating
ratings.reduce((acc, curr) => {
  if (curr > acc) return curr
  return acc
}, 0) //?

// with ternary
ratings.reduce((acc, curr) => (curr > acc ? curr : acc), 0) //?

// with ramda
reduce((acc, curr) => (curr > acc ? curr : acc), 0)(ratings) //?

// with ramda and ifElse
reduce(
  (acc, curr) =>
    ifElse(
      () => curr > acc,
      () => curr,
      () => acc,
    )(),
  0,
)(ratings) //?

// Exercise 18: largest boxart
const boxarts = [
  {
    width: 200,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
  },
  {
    width: 150,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
  },
  {
    width: 300,
    height: 200,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
  },
  {
    width: 425,
    height: 150,
    url: 'http://cdn-0.nflximg.com/images/2891/Fracture425.jpg',
  },
]

// find the largest box art
// Exercise 18: find the url of the largest boxart

const largestBoxart = boxarts.reduce((largest, current) => {
  if (current.width * current.height > largest.width * largest.height) {
    return current
  }
  return largest
}) //?
largestBoxart.url //?

// rewrite with ternary operator
const largestBoxart2 = boxarts.reduce((largest, current) =>
  current.width * current.height > largest.width * largest.height
    ? current
    : largest,
) //?
largestBoxart2.url //?

// rewrite the above in ramda
const largestBoxartR = reduce(
  (largest, current) => {
    if (current.width * current.height > largest.width * largest.height) {
      return current
    }
    return largest
  },
  {width: 0, height: 0}, // we need a comparator object for ramda reduce
) //?
const largestBoxArtUrlR = pipe(largestBoxartR, prop('url')) //?
largestBoxArtUrlR(boxarts) //?

// rewrite the if logic without if

// rewrite with ramda reduce and ternary operator
const largestBoxartR2 = reduce(
  (largest, current) =>
    current.width * current.height > largest.width * largest.height
      ? current
      : largest,
  {width: 0, height: 0}, // we need a comparator object for ramda reduce
) //?
largestBoxartR2(boxarts) //?
pipe(largestBoxartR2, prop('url'))(boxarts) //?

// rewrite using ramda reduce and ramda ifElse instead of ternary operator
const largestBoxartR3 = reduce(
  (largest, current) =>
    ifElse(
      () => current.width * current.height > largest.width * largest.height,
      () => current,
      () => largest,
    )(),
  {width: 0, height: 0},
)
largestBoxartR3(boxarts) //?
pipe(largestBoxartR3, prop('url'))(boxarts) //?
