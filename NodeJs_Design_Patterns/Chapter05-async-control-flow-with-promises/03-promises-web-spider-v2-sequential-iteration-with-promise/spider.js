import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

// use then invocations to sequentially execute get, mkdirp and then writeFile. At the end return the content
function download (url, filename) {
  console.log(`Downloading ${url}`)
  let content
  // use then() to send the request and receive a Promise that fulfills/rejects with the result of the request
  return superagent.get(url)
    .then((res) => {
      content = res.text
      return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      // The final return value of the download() function is the Promise returned by the last then() call in the chain, 
      // which fulfills with the content of the webpage
      return content
    })
}

// deals with a sequential iteration over a dynamic set of asynchronous tasks, builds a chain of promises
function spiderLinks (currentUrl, content, nesting) {
  // empty promise that resolves to undefined and serves as the start point
  let promise = Promise.resolve()

  if (nesting === 0) {
    return promise
  }

  const links = getPageLinks(currentUrl, content)

  // KEY: Pattern (sequential iteration with promises) Dynamically build a chain of promises using a loop.

  // in a loop, we update the promise variable with a new Promise obtained by invoking then() on the previous promise in the chain
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1))
  }
  // At the end of the for loop, the promise variable will contain the promise of the last then() invocation,
  // so it will resolve only when all the promises in the chain have been resolved.
  return promise
}

/*
An alternative of the sequential iteration pattern with promises makes use of the reduce() function, 
for an even more compact implementation:

const promise = tasks.reduce((prev, task) => {
  return prev.then(() => {
    return task()
  })
}, Promise.resolve())

*/

export function spider (url, nesting) {
  const filename = urlToFilename(url)
  return fsPromises.readFile(filename, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename)
    })
    .then(content => spiderLinks(url, content, nesting))
}
