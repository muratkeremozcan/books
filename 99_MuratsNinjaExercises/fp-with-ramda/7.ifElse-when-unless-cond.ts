import {ifElse, when, unless, cond, always, equals, multiply} from 'ramda'

///// ifElse
// We’re used to seeing if statements like this
const hasAccess = true

{
  if (hasAccess) {
    console.log('Access granted.')
  } else {
    console.log('Access denied')
  }

  // An increasingly popular alternative is the ternary statement
  hasAccess ? 'Access granted' : 'Access denied' //?
}

// Ramda provides ifElse, letting you handle branching logic with functions
{
  const logAccess = ifElse(
    () => true, // toggle between true and false
    () => 'Access granted',
    () => 'Access denied',
  )

  logAccess() //?
}

// One advantage is that you can package the logic away into a function
// Instead of hard coding the hasAccess variable, make it a parameter
{
  const logAccess = ifElse(
    (hasAccess: boolean) => hasAccess,
    () => 'Access granted',
    () => 'Access denied',
  )

  logAccess(true) //?
  logAccess(false) //?
}

// This makes a point-free style easier to achieve
{
  const logAccess = ifElse(
    equals(true),
    always('Access granted'),
    always('Access denied'),
  )

  logAccess(true) //?
  logAccess(false) //?
}

/////// when / unless
// Sometimes you only need the if statement, and the else simply returns the value unchanged

const isEven = (num: number) => num % 2 === 0
{
  const doubleIfEven = (num: number) => {
    if (isEven(num)) {
      return num * 2
    }

    return num
  }

  doubleIfEven(2) //?
  doubleIfEven(3) //?
}
// ternary also works
{
  const doubleIfEven = (num: number) => (isEven(num) ? num * 2 : num)

  doubleIfEven(2) //?
  doubleIfEven(3) //?
}

// Ramda provides when and unless, which are like ifElse, but with the else case already handled
{
  const doubleIfEven = when(isEven, num => num * 2)
  const doubleIfEvenR = when(isEven, multiply(2))

  doubleIfEven(2) //?
  doubleIfEvenR(2) //?
  // returns the arg as is if predicate is false
  doubleIfEven(3) //?

  const doubleIfOdd = unless(isEven, multiply(2))
  doubleIfOdd(2) //?
  doubleIfOdd(3) //?
}

//////// cond
// cond is like switch

{
  const findAnimal = (animal: string) => {
    switch (animal) {
      case 'lion':
        return 'Africa and India'

      case 'tiger':
        return 'China, Russia, India, Vietnam, and many more'

      case 'hyena':
        return 'African Savannah'

      case 'grizzly bear':
        return 'North America'

      default:
        return 'Not sure, try Googling it!'
    }
  }

  findAnimal('lion') //?
  findAnimal('monkey') //?
}

// cond takes an array of if/then statements, which are arrays themselves.
// The first function is the predicate, and the second function is what to run if the predicate returns true
{
  const findAnimal = cond([
    [equals('lion'), always('Africa and India')],
    [equals('tiger'), always('China, Russia, India, Vietnam, and many more')],
    [equals('hyena'), always('African Savannah')],
    [equals('grizzly bear'), always('North America')],
    [always(true), always('Not sure, try Googling it!')],
  ])

  findAnimal('lion') //?
  findAnimal('monkey') //?
}
