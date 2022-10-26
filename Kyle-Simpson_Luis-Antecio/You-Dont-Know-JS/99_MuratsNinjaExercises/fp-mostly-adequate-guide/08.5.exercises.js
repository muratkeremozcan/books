import {tap, pipe, add, prop, head, map, concat} from 'ramda'
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
const showWelcome = pipe(prop('name'), concat('Welcome '))
// checkActive :: User -> Result String User
const checkActive = user =>
  user.active ? Result.Ok(user) : Result.Error('Your account is not active')

// resultWelcome :: User -> Result String String
// const resultWelcome = pipe(checkActive, map(showWelcome))
const resultWelcome = pipe(checkActive, map(showWelcome))

resultWelcome(user) //?
resultWelcome('foo') //?
