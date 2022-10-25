import {prop, compose, split, head, map, last, find, curry} from 'ramda'
import {inspect, eq} from '@mostly-adequate/support'
const {task} = require('folktale/concurrency/task')

// not very useful https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08#pure-error-handling

// IO and Task are like AsyncData
// https://swan-io.github.io/boxed/async-data

class IO {
  static of(x) {
    return new IO(() => x)
  }

  constructor(fn) {
    this.$value = fn
  }

  map(fn) {
    return new IO(compose(fn, this.$value))
  }

  inspect() {
    return `IO(${inspect(this.$value)})`
  }
}

// ioWindow :: IO Window
const ioWindow = new IO(() => window)

ioWindow.map(win => win.innerWidth)
// IO(1430)

ioWindow.map(prop('location')).map(prop('href')).map(split('/'))
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])

// $ :: String -> IO [DOM]
const $ = selector => new IO(() => document.querySelectorAll(selector))

$('#myDiv')
  .map(head)
  .map(div => div.innerHTML) //?
// IO('I am some inner html')

// url :: IO String
const url = new IO(() => window.location.href)

// toPairs :: String -> [[String]]
const toPairs = compose(map(split('=')), split('&'))

// params :: String -> [[String]]
const params = compose(toPairs, last, split('?'))

// findParam :: String -> IO Maybe [String]
const findParam = key =>
  map(compose(Option.fromNullable, find(compose(eq(key), head)), params), url)

// -- Impure calling code ----------------------------------------------

// run it by calling $value()!
findParam('searchTerm').$value()
// Just(['searchTerm', 'wafflehouse'])

// -- Node readFile example ------------------------------------------

const fs = require('fs')

// readFile :: String -> Task Error String
const readFile = filename =>
  new task((reject, result) => {
    fs.readFile(filename, (err, data) => (err ? reject(err) : result(data)))
  })

readFile('metamorphosis').map(split('\n')).map(head)
// Task('One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that
// in bed he had been changed into a monstrous verminous bug.')

// -- jQuery getJSON example -----------------------------------------

// getJSON :: String -> {} -> Task Error JSON
const getJSON = curry(
  (url, params) =>
    new task((reject, result) => {
      $.getJSON(url, params, result).fail(reject)
    }),
)

getJSON('/video', {id: 10}).map(prop('title'))
// Task('Family Matters ep 15')

// -- Default Minimal Context ----------------------------------------

// We can put normal, non futuristic values inside as well
// Task(4)
