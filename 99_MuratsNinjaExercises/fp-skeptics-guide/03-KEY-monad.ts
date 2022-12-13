import user from './user.json'
import banners from './banners.json'
import {
  lift,
  tap,
  map,
  chain,
  liftN,
  sum,
  prop,
  path,
  pipe,
  __,
  curry,
} from 'ramda'
import {Option} from '@swan-io/boxed'

prop(__, banners)
type User = typeof user
type Banners = typeof banners

const getUserBanner = (user: User, banners: Banners) =>
  banners[user.accountDetails.address.province as keyof Banners]
getUserBanner(user, banners) //?

// what if user is {} or null? We need error checking
const getUserBannerErrCheck = (user: User, banners: Banners) => {
  if (
    user != null &&
    user.accountDetails != null &&
    user.accountDetails.address != null
  ) {
    return banners[user.accountDetails.address.province as keyof Banners]
  }
}
getUserBannerErrCheck(user, banners) //?

/////
// with ramda
const getUserBannerR = pipe(
  path(['accountDetails', 'address', 'province']) as (user: User) => string,
  prop(__, banners),
)
getUserBannerR(user) //?

// how would we do the error checking? We need monads
// A Promise lets us write code without worrying about whether data is asynchronous or not.
// The Maybe (Option in swan) monad lets us write code without worrying whether data is empty or not.
// There are no if-statements below because we don’t need to check every possible little thing that might be missing.
//  If a value is missing, we get a default value instead

const getUserBannerS = (user: User, banners: Banners) =>
  Option.fromNullable(user)
    .map(path(['accountDetails', 'address', 'province']))
    .flatMap(prop(__, banners))
getUserBannerS(user, banners) //?

// the equivalent of orElse is getWithDefault in Swan
// swan applies ap automatically
const getProvinceBanner = curry((province: keyof Banners, banners) =>
  Option.fromNullable(banners[province]).getWithDefault(
    '/assets/banners/default-banner.jpg',
  ),
)
getProvinceBanner('NT', banners) //?
// @ts-expect-error demoing bad value and getWithDefault in Swan
getProvinceBanner('TR', banners) //?

const getUserBannerS2 = (user: User, banners: Banners) =>
  Option.fromNullable(user)
    .map(path(['accountDetails', 'address', 'province']))
    .flatMap(getProvinceBanner(__, banners))
getUserBannerS2(user, banners) //?
// @ts-expect-error demoing bad value and getWithDefault in Swan
getUserBannerS2('TR', banners) //?

////// lift

const applyBanner = curry(function (el, banner) {
  el.src = banner
  return el
})
const bannerEl = Option.Some('.banner > img')

// needs work
const customizeBanner = pipe(
  // @ts-ignore
  Option.fromNullable,
  map(path(['accountDetails', 'address', 'province'])),
  lift(applyBanner(bannerEl)),
)
customizeBanner(user) //?
