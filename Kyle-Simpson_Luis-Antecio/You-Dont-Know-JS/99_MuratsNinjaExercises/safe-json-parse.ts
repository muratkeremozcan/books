import data from './meals.json'
import {Option} from '@swan-io/boxed'

data //?

function safeJSONParse(body: string | object) {
  try {
    return JSON.parse(body as string)
  } catch (e) {
    return body
  }
}

function safeJSONParseBoxed(body: string | object) {
  return Option.fromNullable(body).match({
    Some: value => value,
    None: () => body,
  })
}

safeJSONParse(data) //?
safeJSONParse('hola') //?

safeJSONParseBoxed(data) //?
safeJSONParseBoxed('hola') //?

safeJSONParseBoxed(data) === safeJSONParse(data) //?
safeJSONParseBoxed('hola') === safeJSONParse('hola') //?
