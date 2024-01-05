// https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

import {
  Either,
  chain,
  left,
  right,
  fold,
  mapLeft,
  map,
  getApplicativeValidation,
} from 'fp-ts/Either'
import {pipe} from 'fp-ts/function'
import {NonEmptyArray} from 'fp-ts/NonEmptyArray'
import {sequenceT} from 'fp-ts/Apply'
import {getSemigroup} from 'fp-ts/NonEmptyArray'

// Either : Either is a functor that represents a value of two possible types (a disjunction)
// useful for error handling
// Right is like Container
// Left ignores the request to map over it

const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left('at least one number')

const validatePassword = (s: string): Either<string, string> =>
  pipe(minLength(s), chain(oneCapital), chain(oneNumber))

const foldEither = fold(
  e => `error: ${e}`,
  success => success,
)

// Because we are using Either the checks are fail-fast.
// That is, any failed check short-circuits subsequent checks so we will only ever get one error

validatePassword('<PASSWORD>') //?
foldEither(validatePassword('ab')) //?
foldEither(validatePassword('<PASSWORD>')) //?
foldEither(validatePassword('abcdef')) //?

// something that works
foldEither(validatePassword('<PASSWORD1>')) //?

//////////////////////////
// it would be nice to have all of these errors be reported simultaneously.
// The Validation abstraction may help here, because they are able to collect multiple failures.

// we must first redefine all the rules so that they return a value of type Either<NonEmptyArray<string>, string>
// Instead of rewriting all the previous functions, which is cumbersome,
// let's define a combinator that converts a check outputting an Either<E, A> into a check outputting a Either<NonEmptyArray<E>, A>
// note: we could use the original functions, with types Either<NonEmptyArray<string>, string>
// then we would not have to lift, but for demo purposes we used lift
const minLengthLifted = (s: string): Either<NonEmptyArray<string>, string> =>
  s.length >= 6 ? right(s) : left(['at least 6 characters'])

//  If you start with functions that return Either<string, A> (a single error string),
// lift is a convenient way to transform these functions to be compatible with getApplicativeValidation

const lift =
  <E, A>(check: (a: A) => Either<E, A>): ((a: A) => Either<NonEmptyArray<E>, A>) =>
  a =>
    pipe(
      check(a),
      mapLeft(a => [a]),
    )

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)

// Let's put all together,
// sequenceT helper takes n actions and does them from left-to-right, returning the resulting tuple
// The getApplicativeValidation function in fp-ts can be used to create an applicative instance that accumulates errors
// instead of failing fast like Either.
// This is useful for scenarios like form validation, where you might want to collect all validation errors rather than stopping at the first error.

const applicativeValidation = getApplicativeValidation(getSemigroup<string>())

const validatePassword2 = (s: string): Either<NonEmptyArray<string>, string> =>
  pipe(
    sequenceT(applicativeValidation)(minLengthV(s), oneCapitalV(s), oneNumberV(s)),
    map(() => s), // if all the validations succeed, just return the original string s
  )
validatePassword2('<PASSWORD>') //?
foldEither(validatePassword2('ab')) //?
foldEither(validatePassword2('<PASSWORD>')) //?
foldEither(validatePassword2('abcdef')) //?

////////
type Person = {
  name: string
  age: number
}

const validateName = (s: string): Either<NonEmptyArray<string>, string> =>
  s.length === 0 ? left(['Invalid name']) : right(s)

const validateAge = (s: string): Either<NonEmptyArray<string>, number> =>
  isNaN(+s) ? left(['Invalid age']) : right(+s)

const toPerson = ([name, age]: [string, number]): Person => ({
  name,
  age,
})

const validatePerson = (name: string, age: string): Either<NonEmptyArray<string>, Person> =>
  pipe(sequenceT(applicativeValidation)(validateName(name), validateAge(age)), map(toPerson))

validatePerson('Murat', '18') //?
foldEither(validatePerson('Murat', '18')) //?
foldEither(validatePerson('', '18')) //?
foldEither(validatePerson('Murat', '18ab')) //?
foldEither(validatePerson('', '18a')) //?
