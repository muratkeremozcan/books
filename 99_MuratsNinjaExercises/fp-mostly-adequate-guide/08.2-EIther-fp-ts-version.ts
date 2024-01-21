import moment from 'moment'
import {left, of, fold} from 'fp-ts/Either'
import {flow, identity} from 'fp-ts/function'
import {prop, curry, compose, concat, add, map, toString} from 'ramda'

type User = {birthDate: string}

// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now: moment.Moment, user: User) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')

  return birthDate.isValid()
    ? of(Math.abs(birthDate.diff(now, 'years'))) // Result.Ok in swan-io
    : left('Birth date could not be parsed') // Result.Error in swan-io
})

getAge(moment(), {birthDate: '2022-12-12'}) //?
getAge(moment(), {birthDate: 'July 4, 2001'}) //?

// fortune :: Number -> String
const fortune = flow(add(1), toString, concat('If you survive, you will be '))

// zoltar :: User -> _
const zoltar = flow(getAge(moment()), fold(identity, fortune), console.log)

zoltar({birthDate: '2005-12-12'}) //?
