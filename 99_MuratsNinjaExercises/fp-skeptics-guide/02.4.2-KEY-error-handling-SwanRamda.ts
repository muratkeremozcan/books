import R from 'ramda'
import {Result, AsyncData, Serializer} from '@swan-io/boxed'
import data from './notificationData.json'

// Assume the data is coming in from the network as JSON.
const notificationDataJSON = JSON.stringify(data)

// TypeScript equivalent of getSet
const getSet =
  (getKey: string, setKey: string, transform: Function) => (obj: any) => ({
    ...obj,
    [setKey]: transform(obj[getKey]),
  })

/** Generate a readable date */
const addReadableDate = getSet('date', 'readableDate', (t: string) =>
  // @ts-ignore
  new Date(t * 1000).toGMTString(),
)

/**  Sanitize the message to prevent cross-site scripting (XSS) attacks */
const sanitizeMessage = getSet('message', 'message', (msg: string) =>
  msg.replace(/</g, '&lt;'),
)

/**  Build a link to the sender’s profile page */
const buildLinkToSender = getSet(
  'username',
  'sender',
  (u: string) => `https://example.com/users/${u}`,
)

/**  Build a link to the source of the notification */
const buildLinkToSource = (notification: {
  sourceType: string
  sourceId: string
}) => ({
  ...notification,
  source: `https://example.com/${notification.sourceType}/${notification.sourceId}`,
})

const urlPrefix = 'https://example.com/assets/icons/'
const iconSuffix = '-small.svg'

// Tell the template what icon to display, based on the source type.
const addIcon = getSet(
  'sourceType',
  'icon',
  (sourceType: string) => `${urlPrefix}${sourceType}${iconSuffix}`,
)

// sync data

const parseJSON = (dataFromServer: string | Error) => {
  try {
    return Result.Ok(Serializer.decode(dataFromServer as string)).value
  } catch (e) {
    return Result.Error(e).value
  }
}

// error works
parseJSON(new Error('I am error')) //?
// parse works
const notificationData = parseJSON(notificationDataJSON) //?

const dataForTemplate = R.pipe(
  R.map(addReadableDate),
  R.map(sanitizeMessage),
  R.map(buildLinkToSender),
  R.map(buildLinkToSource),
  R.map(addIcon),
) /*?.*/

dataForTemplate(notificationData) //?

// AsyncData

const parseJSONAsync = (dataFromServer: string | Error) => {
  try {
    return AsyncData.Done(dataFromServer)
      .toOption()
      .toResult(_)
      .flatMap(() => Result.Ok(Serializer.decode(dataFromServer as string)))
      .value
  } catch (e) {
    return AsyncData.Done(dataFromServer)
      .toOption()
      .toResult('err')
      .flatMapError(_ => Result.Error(e)).value
  }
}

parseJSONAsync(new Error('I am error')) //?

const notificationDataAsync = parseJSONAsync(notificationDataJSON) //?
dataForTemplate(notificationDataAsync) //?
