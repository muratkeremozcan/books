import user from './user.json'
import banners from './banners.json'
import {prop, path, pipe, __, identity} from 'ramda'
import {Option} from '@swan-io/boxed'

prop(__, banners)
type User = typeof user
type Banners = typeof banners

const getUserBanner = (banners: Banners, user: User) =>
  banners[user.accountDetails.address.province as keyof Banners]

getUserBanner(banners, user) //?

// what if user is {} or null? We need error checking
const getUserBannerErrCheck = (banners: Banners, user: User) => {
  if (
    user != null &&
    user.accountDetails != null &&
    user.accountDetails.address != null
  ) {
    return banners[user.accountDetails.address.province as keyof Banners]
  }
}
getUserBannerErrCheck(banners, user) //?

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
//  If a value is missing, the next step just isn’t executed.

const getUserBannerS = (banners: Banners, user: User) =>
  Option.fromNullable(user)
    .map(path(['accountDetails', 'address', 'province']))
    .flatMap(prop(__, banners))

getUserBannerS(banners, user) //?

const getProvinceBanner = (province: keyof Banners) =>
  Option.fromNullable(banners[province]).flatMap(
    identity as (value: string) => Option<unknown>,
  )
getProvinceBanner('NT') //?

const getUserBannerS2 = (user: User) =>
  Option.fromNullable(user)
    .map(path(['accountDetails', 'address', 'province']))
    .flatMap(getProvinceBanner as (value: unknown) => Option<unknown>)
getUserBannerS2(user) //?
