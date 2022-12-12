import user from './user.json'
import banners from './banners.json'
import {liftN, prop, path, pipe, __, identity, curry} from 'ramda'
import {Option} from '@swan-io/boxed'

const Maybe = function (val) {
  this.__value = val
}
Maybe.of = function (val) {
  return new Maybe(val)
}
Maybe.prototype.isNothing = function () {
  return this.__value === null || this.__value === undefined
}
Maybe.prototype.map = function (f) {
  if (this.isNothing()) {
    return Maybe.of(null)
  }
  return Maybe.of(f(this.__value))
}
Maybe.prototype.join = function () {
  return this.__value
}
Maybe.prototype.chain = function (f) {
  return this.map(f).join()
}

{
  function getUserBanner(banners, user) {
    return Maybe.of(user)
      .map(prop('accountDetails'))
      .map(prop('address'))
      .map(prop('province'))
      .map(prop(__, banners))
  }
  getUserBanner(banners, user) //?
}

const getProvinceBanner = function (province) {
  return Maybe.of(banners[province])
}
function getUserBanner(user) {
  return Maybe.of(user)
    .map(path(['accountDetails', 'address', 'province']))
    .chain(getProvinceBanner)
}
getUserBanner(user) //?

Maybe.prototype.orElse = function (dflt) {
  if (this.isNothing()) {
    return Maybe.of(dflt)
  }

  return this
}

Maybe.prototype.ap = function (someOtherMaybe) {
  return someOtherMaybe.map(this.__value)
}

// Provide a default banner with .orElse()
const bannerSrc = getUserBanner(user).orElse(
  '/assets/banners/default-banner.jpg',
)
// Grab the banner element and wrap it in a Maybe too.
const bannerEl = Maybe.of('.banner > img')
bannerEl

const applyBanner = curry(function (el, banner) {
  el = banner
  return el
})

bannerEl.map(applyBanner) //?
bannerEl.map(applyBanner).ap(bannerSrc) //?

const liftA2 = curry(function (fn, m1, m2) {
  return m1.map(fn).ap(m2)
})

const applyBannerMaybe = liftA2(applyBanner)
const applyBannerMaybeR = liftN(2, applyBanner)
const mutatedBanner = applyBannerMaybe(bannerEl, bannerSrc) //?
applyBannerMaybeR(bannerEl, bannerSrc) //?
