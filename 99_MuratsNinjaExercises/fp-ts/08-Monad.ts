import {flatten as flattenArray, chain as chainArray} from 'fp-ts/Array'
import {
  type Option,
  some,
  none,
  map,
  fold,
  flatten as flattenOption,
  chain as chainOption,
} from 'fp-ts/Option'
import {head} from 'fp-ts/Array'

// https://dev.to/gcanti/getting-started-with-fp-ts-monad-6k

/*
Pointed functor: a functor with an of method; drop-in any value into the functor and start mapping away, aka. Lift any value in our type
Monad: Pointed functor that can flattens, while maintaining code readability and composability.

Monads come into play when you want to generalize this pattern of applying a function to a value in a context (like an array or an option) 
and then flattening the nested result. 
In functional programming, the flatMap/flatten function embodies this pattern. 
It combines mapping a function over a value in a context and then flattening the result.

*/

// Array example

type User = {
  name: string
  followers: User[]
}

const alice: User = {name: 'Alice', followers: []}
const bob: User = {name: 'Bob', followers: [alice]}
const carol: User = {name: 'Carol', followers: [bob, alice]}

const getFollowers = (user: User): User[] => user.followers

const followersOfFollowers0: User[][] = getFollowers(carol).map(getFollowers)
followersOfFollowers0 //?

// we need to flatten nested arrays
const followersOfFollowers1: User[] = flattenArray(getFollowers(carol).map(getFollowers))
followersOfFollowers1 //?

// In fp-ts the flatMap function is modeled by a variant called chain, which is basically flatMap with the arguments rearranged
const followersOfFollowersChain: User[] = chainArray(getFollowers)(getFollowers(carol))
followersOfFollowersChain //?

// btw, JS & TS have flatMap
getFollowers(carol).flatMap(getFollowers) //?

// Option example
// Say we want to calculate the inverse of the head of a numeric list

const sampleArr = [2, 3, 4, 5]
const inverse = (n: number): Option<number> => (n === 0 ? none : some(1 / n))
head(sampleArr) //?
const sampleArrHead = head(sampleArr)

const inverseHead: Option<Option<number>> = map(inverse)(sampleArrHead)
const inverseHeadChain: Option<number> = chainOption(inverse)(sampleArrHead) // chain comes flattened

// which comes nested
inverseHead //?
// we have to flatten it
flattenOption(inverseHead) //?
const flatInverseHead = flattenOption(inverseHead)
flatInverseHead //?

// but, chain is already flattened
inverseHeadChain //?

const foldOptionToNumber = (option: Option<number>, defaultValue: number) =>
  fold(
    () => defaultValue,
    (a: number) => a,
  )(option)

foldOptionToNumber(flatInverseHead, -1) //?
foldOptionToNumber(inverseHeadChain, -1) //?

/*

Program f			Program g							Composition
pure					pure									g ∘ f
effectful			pure (unary)					lift(g) ∘ f
effectful			pure (n-ary, n > 1)		liftAn(g) ∘ f    (theoretical... I just use monad here)
effectful     effectful             flatMap(g) ∘ f

*/
