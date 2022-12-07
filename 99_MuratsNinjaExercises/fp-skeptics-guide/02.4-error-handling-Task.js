// from https://cs.github.com/iq-mschmeets/js-pqyskd/blob/bb0fe315b7ef24e4044157b880deb7df4646d31d/Utils.js

import R from 'ramda'
import data from './notificationData.json'
// assume the data is coming in from the network as JSON
const notificationDataJSON = JSON.stringify(data)

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

const Task = run => ({
  map: f =>
    Task((resolve, reject) => {
      run(x => resolve(f(x)), reject)
    }),
  peekErr: f =>
    Task((resolve, reject) => {
      run(resolve, err => {
        f(err)
        reject(err)
      })
    }),
  run: (onResolve, onReject) => run(onResolve, onReject),
  scan: (f, x0) =>
    Task((resolve, reject) =>
      run(
        x => resolve(f(x0, x)),
        e => resolve(x0),
      ),
    ),
})

const map = f => functor => functor.map(f)
const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0)
const scan = (f, x0) => scannable => scannable.scan(f, x0)
const peekErr = f => result => result.peekErr(f)
const fallbackValue = 'something went wrong'

// re-write parseJSON with Task
const parseJSON = dataFromServer =>
  Task((resolve, reject) => {
    try {
      const parsed = JSON.parse(dataFromServer)
      resolve(parsed)
    } catch (e) {
      reject(e)
    }
  })

const notificationData = parseJSON(notificationDataJSON) //?

const taskForTemplateData = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  // peekErr(console.warn),
  // scan((_, val) => val, fallbackValue),
)
// taskForTemplateData.run(console.log, console.warn)

// where did renderNotifications come from?

// taskForTemplateData.run(
//   renderNotifications,
//   handleError
// );
