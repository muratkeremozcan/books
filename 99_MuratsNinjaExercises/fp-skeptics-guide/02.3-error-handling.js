// from https://cs.github.com/iq-mschmeets/js-pqyskd/blob/bb0fe315b7ef24e4044157b880deb7df4646d31d/Utils.js

import R from 'ramda'
import data from './notificationData.json'
// assume the data is coming in from the network as JSON
const notificationDataJSON = JSON.stringify(data)

const getSet = (getKey, setKey, transform) => obj => ({
  ...obj,
  [setKey]: transform(obj[getKey]),
})

const addReadableDate = getSet('date', 'readableDate', t =>
  new Date(t * 1000).toGMTString(),
)
const sanitizeMessage = getSet('message', 'message', msg =>
  msg.replace(/</g, '&lt;'),
)

const map = f => functor => functor.map(f)
const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0)

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

const scan = (f, x0) => scannable => scannable.scan(f, x0)
