import {Option, Result} from '@swan-io/boxed'
import {ifElse, when, unless, cond, always, equals, multiply} from 'ramda'

const PageSpinner = 'PageSpinner'
const ErrorComp = 'ErrorComp'

// triggerPageSpinner
const Status = 'loading'
const isUpdating = true
const postError = false
const isUpdateError = false

// trigger ErrorComp
// const Status = 'done'
// const isUpdating = false
// const postError = true
// const isUpdateError = true

function comp() {
  if (Status === 'loading' || isUpdating) {
    return PageSpinner
  }

  if (postError || isUpdateError) {
    return ErrorComp
  }
}
comp() //?

///// ramda cond
const compSwanR = cond([
  [() => Status === 'loading' || isUpdating, always(PageSpinner)],
  [() => postError || isUpdateError, always(ErrorComp)],
])

compSwanR() //?

//// ramda ifElse
const compSwanS = ifElse(
  () => Status === 'loading' || isUpdating,
  () => PageSpinner,
  () =>
    ifElse(
      () => postError || isUpdateError,
      () => ErrorComp,
      () => null,
    )(),
)
compSwanS() //?

//// ramda when
const compSwanRWhen = when(
  () => Status === 'loading' || isUpdating,
  always(PageSpinner),
)
compSwanRWhen(null) //?

//// ramda unless
const compSwanUnless = unless(
  () => postError || isUpdateError,
  always(ErrorComp),
)
compSwanUnless(null) //?

/// rewrite using swan-io Result monad
const renderResult = (c: any) => (c ? Result.Ok(c) : Result.Error(c))

renderResult(Status === 'loading' || isUpdating) //?
renderResult(postError || isUpdateError) //?

// @ts-ignore
renderResult(Status === 'loading' || isUpdating).match({
  Ok: always(PageSpinner),
  Error: always(ErrorComp),
}) //?
