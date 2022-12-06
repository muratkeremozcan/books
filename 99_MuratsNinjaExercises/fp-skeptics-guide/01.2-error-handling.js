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

// problem: each of the fns needs to get littered with error handling

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
