import R from 'ramda'
import data from './notificationData.json'
// assume the data is coming in from the network as JSON
const notificationDataJSON = JSON.stringify(data)

// both Just and Nothing return an object with a map method, hence they are functors
// we have reduce to get our value out of the Just wrapper at the end

const OK = val => ({
  map: f => OK(f(val)),
  reduce: (f, x0) => f(x0, val),
  peekErr: () => OK(val),
})

const Err = e => {
  const err = {
    map: _ => err,
    reduce: (_, x0) => x0,
    peekErr: f => {
      f(x)
      return err
    },
  }
  return err
}

const parseJSON = dataFromServer => {
  try {
    return OK(JSON.parse(dataFromServer)).reduce((_, x) => x, undefined)
  } catch (e) {
    return Err(e)
  }
}
// try-catch version
// const parseJSON = dataFromServer => {
//   try {
//     const parsed = JSON.parse(dataFromServer)
//     return parsed
//   } catch (_) {
//     return undefined
//   }
// }

// get the value out
const notificationData = parseJSON(notificationDataJSON)

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
const map = f => functor => functor.map(f)
const pipe = (x0, ...fns) => fns.reduce((x, f) => f(x), x0)
const reduce = (f, x0) => foldable => foldable.reduce(f, x0)
// having trouble after this
const peekErr = f => result => result.peekErr(f)
const fallbackValue = 'something went wrong'

const dataForTemplateF = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  // peekErr(console.warn),
  // reduce((_, val) => val, fallbackValue),
)

R.equals(dataForTemplateF, dataForTemplate) //?
