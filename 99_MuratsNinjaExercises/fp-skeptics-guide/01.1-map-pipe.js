import R from 'ramda'
import notificationData from './notificationData.json'
// const notificationData = require('./notificationData.json')

const getSet = (getKey, setKey, transform) => obj => ({
  ...obj,
  [setKey]: transform(obj[getKey]),
})
/** Generate a readable date */
const addReadableDate = getSet('date', 'readableDate', t =>
  new Date(t * 1000).toGMTString(),
)
/**  Sanitize the message to prevent cross-site scripting (XSS) attacks */
const sanitizeMessage = getSet('message', 'message', msg =>
  msg.replace(/</g, '&lt;'),
)
/**  Build a link to the sender’s profile page */
const buildLinkToSender = getSet(
  'username',
  'sender',
  u => `https://example.com/users/${u}`,
)

/**  Build a link to the source of the notification */
const buildLinkToSource = notification => ({
  ...notification,
  source: `https://example.com/${notification.sourceType}/${notification.sourceId}`,
})

const urlPrefix = 'https://example.com/assets/icons/'
const iconSuffix = '-small.svg'
// Tell the template what icon to display, based on the source type.
const addIcon = getSet(
  'sourceType',
  'icon',
  sourceType => `${urlPrefix}${sourceType}${iconSuffix}`,
)

/////
// use variable assignments (basic)
const withDates = notificationData.map(addReadableDate)
const sanitized = withDates.map(sanitizeMessage)
const withSenders = sanitized.map(buildLinkToSender)
const withSources = withSenders.map(buildLinkToSource)
const dataForTemplate = withSources.map(addIcon)

// use chain (intermediate)
const dataForTemplateC = notificationData
  .map(addReadableDate)
  .map(sanitizeMessage)
  .map(buildLinkToSender)
  .map(buildLinkToSource)
  .map(addIcon)
R.equals(dataForTemplateC, dataForTemplate) //?

// use ramda to compose the functions
const dataForTemplateR = R.pipe(
  R.map(addReadableDate),
  R.map(sanitizeMessage),
  R.map(buildLinkToSender),
  R.map(buildLinkToSource),
  R.map(addIcon),
)(notificationData)
R.equals(dataForTemplateR, dataForTemplate) //?

// use functors
// terminology:
// Container : a type that wraps a value
// Functor : Container + has map
// Pointed Functor : Functor + has of
// Monad : Pointed Functor + has flatten
const map = f => functor => functor.map(f)
/** The pipe function uses the spread operator to turn all but the first argument into an array.
 * Then it passes that first argument to the first function. And the result of that to the next function. And so on. */
const pipe = (x0, ...fns) => fns.reduce((x, f) => f(x), x0)

const dataFoTemplateF = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
)
R.equals(dataFoTemplateF, dataForTemplate) //?
