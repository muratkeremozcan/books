// from https://cs.github.com/iq-mschmeets/js-pqyskd/blob/bb0fe315b7ef24e4044157b880deb7df4646d31d/Utils.js

import R from 'ramda'
import {Result, AsyncData} from '@swan-io/boxed'
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

const parseJSON = dataFromServer =>
  Result.Ok(dataFromServer).match({
    Ok: dataFromServer => JSON.parse(dataFromServer),
    Error: e => `${e}: error`,
  })

const notificationData = parseJSON(notificationDataJSON) //?

const dataForTemplate = R.pipe(
  R.map(addReadableDate),
  R.map(sanitizeMessage),
  R.map(buildLinkToSender),
  R.map(buildLinkToSource),
  R.map(addIcon),
)

dataForTemplate(notificationData) //?

// async version
// note that there is no toResult(), you can convert to Option first then to Result
const parseJSONAsync = dataFromServer =>
  AsyncData.Done(dataFromServer)
    .toOption()
    .toResult()
    .match({
      Ok: dataFromServer => JSON.parse(dataFromServer),
      Error: e => `${e}: error`,
    })

const notificationDataAsync = parseJSONAsync(notificationDataJSON) //?

dataForTemplate(notificationDataAsync) //?
