import R from 'ramda'
import notificationData from './notificationData.json'

/** we catch the error, and return undefined if the response doesn’t parse.
 * Remember safe-json-parse.ts
 */
const parseJSON = dataFromServer => {
  try {
    const parsed = JSON.parse(dataFromServer)
    return parsed
  } catch (_) {
    return undefined
  }
}

// PROBLEM 1: each of the fns needs to get littered with error handling
// PROBLEM 2: we have to pass the notificationData as arg to all functions but buildLinkToSource (it had it before already)

const getSet = (getKey, setKey, transform) => obj => ({
  ...obj,
  [setKey]: transform(obj[getKey]),
})
/** Generate a readable date */
const addReadableDate = notification => {
  if (notification !== undefined) {
    return getSet('date', 'readableDate', t => new Date(t * 1000).toGMTString())
  } else {
    return undefined
  }
}

/**  Sanitize the message to prevent cross-site scripting (XSS) attacks */
const sanitizeMessage = notification => {
  if (notification !== undefined) {
    return getSet('message', 'message', msg => msg.replace(/</g, '&lt;'))
  } else {
    return undefined
  }
}
/**  Build a link to the sender’s profile page */
const buildLinkToSender = notification => {
  if (notification !== undefined) {
    return getSet('username', 'sender', u => `https://example.com/users/${u}`)
  } else {
    return undefined
  }
}

/**  Build a link to the source of the notification */
const buildLinkToSource = notification => {
  if (notification !== undefined) {
    return {
      ...notification,
      source: `https://example.com/${notification.sourceType}/${notification.sourceId}`,
    }
  } else {
    return undefined
  }
}

const urlPrefix = 'https://example.com/assets/icons/'
const iconSuffix = '-small.svg'
// Tell the template what icon to display, based on the source type.
const addIcon = notification => {
  if (notification !== undefined) {
    return getSet(
      'sourceType',
      'icon',
      sourceType => `${urlPrefix}${sourceType}${iconSuffix}`,
    )
  } else {
    return undefined
  }
}

const withDates = notificationData.map(addReadableDate(notificationData))
const sanitized = withDates.map(sanitizeMessage(notificationData))
const withSenders = sanitized.map(buildLinkToSender(notificationData))
const withSources = withSenders.map(buildLinkToSource)
const dataForTemplate = withSources.map(addIcon(notificationData))

// use chain (intermediate)
const dataForTemplateC = notificationData
  .map(addReadableDate(notificationData))
  .map(sanitizeMessage(notificationData))
  .map(buildLinkToSender(notificationData))
  .map(buildLinkToSource)
  .map(addIcon(notificationData))
R.equals(dataForTemplateC, dataForTemplate) //?

// use ramda to compose the functions
const dataForTemplateR = R.pipe(
  R.map(addReadableDate(notificationData)),
  R.map(sanitizeMessage(notificationData)),
  R.map(buildLinkToSender(notificationData)),
  R.map(buildLinkToSource),
  R.map(addIcon(notificationData)),
)(notificationData)
R.equals(dataForTemplateR, dataForTemplate) //?

const map = f => functor => functor.map(f)
/** The pipe function uses the spread operator to turn all but the first argument into an array.
 * Then it passes that first argument to the first function. And the result of that to the next function. And so on. */
const pipe = (x0, ...fns) => fns.reduce((x, f) => f(x), x0)

const dataFoTemplateF = pipe(
  notificationData,
  map(addReadableDate(notificationData)),
  map(sanitizeMessage(notificationData)),
  map(buildLinkToSender(notificationData)),
  map(buildLinkToSource),
  map(addIcon(notificationData)),
)
R.equals(dataFoTemplateF, dataForTemplate) //?
