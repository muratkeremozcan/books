import R from 'ramda'
import {Result, AsyncData, Serializer} from '@swan-io/boxed'
import data from './notificationData.json'
import axios from 'axios'

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

////// Sync data

// KEY: we use monads so that if there is an error, it flows through the pipeline
// this way we do not have to litter the above functions with if else statements

const parseJSON = (dataFromServer: string | Error) => {
  try {
    return Result.Ok(Serializer.decode(dataFromServer as string)).value
  } catch (e) {
    return Result.Error(e).value
  }
}

// error works
const erroneousData = parseJSON(new Error('I am error')) //?
// parse works
const notificationData = parseJSON(notificationDataJSON) //?

// we can get the data through the pipe, and ramda is performant (measure performance with quokka /*?.*/)
const dataForTemplate = R.pipe(
  R.map(addReadableDate),
  R.map(sanitizeMessage),
  R.map(buildLinkToSender),
  R.map(buildLinkToSource),
  R.map(addIcon),
) /*?.*/

dataForTemplate(notificationData) //?

// AsyncData
// to simulate truly async data, we use json server
// at repo root run the script: yarn start:api
// at your browser, try the url: http://localhost:4000/notificationData

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

const getAsyncData = axios({
  method: 'GET',
  baseURL: 'http://localhost:4000/notificationData',
})
  .then(res => {
    // try using the non async version, parseJSON, it won't work
    const notificationDataAsync = parseJSONAsync(res.data) //?
    return dataForTemplate(notificationDataAsync) //?

    // note: you can also try replacing res.data with new Error('I am error')
    // note: you can stringify the data again, and that works too:  const responseData = JSON.stringify(res.data), and use it in the next line
  })
  .catch(err => {
    throw Error(`There was a problem fetching data: ${err}`)
  })

// YOU MUST START THE API to get a good response
// and turn it off to simulate error
getAsyncData //?
