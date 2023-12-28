import {Semigroup, concatAll} from 'fp-ts/Semigroup'
import {number} from 'fp-ts'

// Use SemigroupSum and SemigroupProduct from 'fp-ts/number'
const SemigroupSum: Semigroup<number> = number.SemigroupSum
const SemigroupProduct: Semigroup<number> = number.SemigroupProduct

// Create functions for sum and product
const sum = concatAll(SemigroupSum)(0)
const product = concatAll(SemigroupProduct)(1)

console.log(sum([1, 2, 3, 4])) // Output: 10
console.log(product([1, 2, 3, 4])) // Output: 48
