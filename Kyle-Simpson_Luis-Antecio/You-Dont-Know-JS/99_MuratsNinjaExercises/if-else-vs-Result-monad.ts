import {Result, Option} from '@swan-io/boxed'

const condition = false
{
  if (condition) {
    console.log('it is true')
  } else {
    console.log('nope')
  }
}

// imperative refactoring
const f = () => 'it is true'
const g = () => 'nope'
{
  // now execute the condition and one of the functions
  if (condition) {
    f()
  } else {
    g()
  }
}

{
  const truthyResult = (c: boolean) => (c ? Result.Ok(c) : Result.Error(c))

  truthyResult(condition) //?

  const h = () => 'BREAKING NEWS!'

  // @ts-ignore
  truthyResult(condition).match({
    Ok: h,
    Error: g,
  }) //?
}
