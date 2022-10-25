import {pipe, add, prop, compose, head, map, append} from 'ramda'
import {Result, Option} from '@swan-io/boxed'

// Use add and map to make a function that increments a value inside a functor.
// incrementFunctor :: Functor f => f Int -> f Int
const incrementFunctor = map(add(1))
incrementFunctor(Option.Some(2)) //?

// Given the object user
// Use safeProp and head to find the first initial of the user.
const user = {id: 2, name: 'Albert', active: true}
// initial :: User -> Maybe String
const initial = pipe(prop('name'), head)
initial(user) //?

// Given the helper fns
// Write a function that uses checkActive and showWelcome to grant access or return the error.

// showWelcome :: User -> String
const showWelcome = compose(append('Welcome '), prop('name'))
// checkActive :: User -> Either String User
const checkActive = function checkActive(user) {
  return user.active
    ? Result.Ok(user)
    : Result.Error('Your account is not active')
}
// eitherWelcome :: User -> Either String String
const eitherWelcome = pipe(checkActive, map(showWelcome))

eitherWelcome(user) //?
eitherWelcome('foo') //?
