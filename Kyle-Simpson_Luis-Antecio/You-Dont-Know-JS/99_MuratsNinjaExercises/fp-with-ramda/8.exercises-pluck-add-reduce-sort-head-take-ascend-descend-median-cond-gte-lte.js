import * as R from 'ramda'
import cart from './cart.json'
import meals from './meals.json'
import employees from './employees.json'
import scores from './scores.json'

/// 1. cart total

const toUSD = amount =>
  amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})

const getTotalPrice = cart => {
  const total = cart.reduce((acc, item) => acc + item.price, 0)
  return toUSD(total)
}
const getTotalPriceR = R.pipe(
  R.reduce((acc, item) => acc + item.price, 0),
  toUSD,
)

getTotalPrice(cart) //?
getTotalPriceR(cart) //?

const getTotalPriceR2 = R.pipe(
  R.pluck('price'),
  // R.tap(console.log),
  // R.reduce(R.add, 0),
  R.sum, // R.sum is the same as R.reduce(R.add, 0)
  toUSD,
)
getTotalPriceR2(cart) //?

/// 2. cheapest item

// solution with reduce
const getCheapestItem = cart =>
  cart.reduce((acc, item) => (item.price < acc.price ? item : acc))
// reduce with ramda (mind the comparator object we need)
const getCheapestItemR = R.pipe(
  R.reduce((acc, item) => (item.price < acc.price ? item : acc), {
    price: Infinity,
  }),
)
// solution with sort
const getCheapestItem2 = cart => {
  const byPrice = cart.sort((a, b) => a.price - b.price)
  return byPrice[0] //?
}
const getCheapestItemR2 = R.pipe(
  R.sort(R.ascend(R.prop('price'))), // R.ascend(R.prop('price')) is the same as (a,b) => a.price - b.price
  // R.sort((a, b) => a.price - b.price),
  // list => list[0],
  R.head, // R.head is the same as list => list[0] or like first() in Cypress
)

getCheapestItem(cart) //?
getCheapestItemR(cart) //?
getCheapestItem2(cart) //?
getCheapestItemR(cart) //?
getCheapestItemR2(cart) //?

//// get the 3 top rated meals

const getTop3MealsFor = (maxPrice, meals) =>
  meals
    .filter(meal => meal.price <= maxPrice)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

// the 2 args are being fed in to the pipe
const getTop3MealsForR = R.pipe(
  (maxPrice, meals) => meals.filter(R.propSatisfies(R.gte(maxPrice), 'price')),
  // (maxPrice, meals) => meals.filter(meal => meal.price <= maxPrice),
  R.sort(R.descend(R.prop('rating'))), // R.descend(R.prop('rating')) is the same as (a,b) => b.rating - a.rating
  // R.sort((a, b) => b.rating - a.rating),
  R.take(3), // R.take(3)(list) is the same as list => list.slice(0, 3)
  // R.slice(0, 3),
)

getTop3MealsFor(12, meals) //?
getTop3MealsForR(12, meals) //?

/// 3. median paycheck

// calculate the median of an array
// const median = list => {
//   const sorted = list.sort((a, b) => a - b)
//   const middle = Math.floor(sorted.length / 2)
//   return sorted.length % 2 === 0
//     ? (sorted[middle] + sorted[middle - 1]) / 2
//     : sorted[middle]
// }

const getMedianPaycheck = employees => {
  const sortedEmployees = employees.map(e => e.salary).sort((a, b) => a - b)
  const middle = Math.floor(sortedEmployees.length / 2)
  const median =
    sortedEmployees.length % 2 === 0
      ? (sortedEmployees[middle] + sortedEmployees[middle - 1]) / 2
      : sortedEmployees[middle]

  return toUSD(median)
}

// get median paycheck with ramda
const getMedianPaycheckR = R.pipe(
  R.pluck('salary'),
  R.sort(R.ascend(R.identity)), // R.ascend(R.identity) is the same as R.sort((a,b) => a - b)
  // R.sort((a, b) => a - b),
  R.median,
  toUSD,
)

getMedianPaycheck(employees) //?
getMedianPaycheckR(employees) //?

//// 4. credit scores

const reviewCreditScore = score => {
  if (score >= 800) return `${score} is excellent!`
  if (score >= 700) return `${score} is good`
  if (score >= 650) return `${score} is fair`
  else return `${score} is poor`
}

const reviewCreditScoreR = R.cond([
  [score => score >= 800, score => `${score} is excellent!`],
  [score => score >= 700, score => `${score} is good`],
  [score => score >= 650, score => `${score} is fair`],
  [R.always(true), score => `${score} is poor`],
])

// the arg coming in is greater than or equal to 800
const reviewCreditScoreR2 = R.cond([
  [R.gte(R.__, 800), score => `${score} is excellent!`],
  [R.gte(R.__, 700), score => `${score} is good`],
  [R.gte(R.__, 650), score => `${score} is fair`],
  [R.T, score => `${score} is poor`],
])

reviewCreditScore(800) //?
reviewCreditScoreR(800) //?
reviewCreditScore(500) //?
reviewCreditScoreR(500) //?
reviewCreditScoreR2(500) //?

const reviewCreditScores = scores => scores.map(reviewCreditScore)
const reviewCreditScoresR = R.map(reviewCreditScoreR2)

reviewCreditScores(scores) //?
reviewCreditScoresR(scores) //?

// alternative : 800 is less than or equal to the arg coming in
const reviewCreditScoreF = R.cond([
  [R.lte(800), score => `${score} is excellent!`],
  [R.lte(700), score => `${score} is good`],
  [R.lte(650), score => `${score} is fair`],
  [R.T, score => `${score} is poor`],
])

reviewCreditScoreF(801) //?
