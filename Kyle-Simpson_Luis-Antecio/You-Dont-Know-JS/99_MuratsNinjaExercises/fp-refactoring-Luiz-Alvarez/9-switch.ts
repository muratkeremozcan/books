import {ifElse, when, unless, cond, always, equals, multiply} from 'ramda'
// switch statement refactor

const hi = (name: string) => `Hi ${name}`
const bye = (name: string) => `Bye ${name}`
const morning = (name: string) => `Good morning ${name}`
const afternoon = (name: string) => `Good afternoon ${name}`
const evening = (name: string) => `Good evening ${name}`
const anything = (name: string) => `Anything ${name}`

{
  function greet(action: string, name: string) {
    switch (action) {
      case 'sayHi':
        return hi(name)
      case 'sayBye':
        return bye(name)
      case 'sayMorning':
        return morning(name)
      case 'sayAfternoon':
        return afternoon(name)
      case 'sayEvening':
        return evening(name)
      default:
        return anything(name)
    }
  }

  greet('sayHi', 'Luis') //?
}

// convert switch statement cases to an object
{
  type Greeting = {
    [key: string]: (name: string) => string
  }
  const greetings: Greeting = {
    sayHi: hi,
    sayBye: bye,
    sayMorning: morning,
    sayAfternoon: afternoon,
    sayEvening: evening,
  }

  function greet(action: string, name: string) {
    return greetings[action] ? greetings[action](name) : anything(name)
  }
  // rewrite  greet using ramda ifElse
  // const greet = ifElse(
  //   action => greetings[action],
  //   (action, name) => greetings[action](name),
  //   anything,0
  // )

  greet('sayHi', 'Luis') //?
}

// use ramda cond (example of of cond taking 2 arguments)
// cond takes an array of if/then statements, which are arrays themselves.
// The first function is the predicate, and the second function is what to run if the predicate returns true
// for the predicate, we only need the first argument: (greeting, name) => greeting === 'sayHi'
// the 2nd functions do not use their first argument
{
  const greet2 = cond([
    [equals('sayHi'), (_: string, name: string) => hi(name)], //?
    [equals('sayBye'), (_: string, name: string) => bye(name)], //?
    [equals('sayMorning'), (_: string, name: string) => morning(name)], //?
    [equals('sayAfternoon'), (_: string, name: string) => afternoon(name)], //?
    [equals('sayEvening'), (_: string, name: string) => evening(name)], //?
    [always(true), (_: string, name: string) => anything(name)],
  ])

  greet2('sayHi', 'Luis') //?
}
