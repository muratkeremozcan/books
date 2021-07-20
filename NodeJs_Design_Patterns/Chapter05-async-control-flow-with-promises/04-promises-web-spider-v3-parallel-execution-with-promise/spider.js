import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

function download (url, filename) {
  console.log(`Downloading ${url}`)
  let content
  return superagent.get(url)
    .then(res => {
      content = res.text
      return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content
    })
}

function spiderLinks (currentUrl, content, nesting) {
  if (nesting === 0) {
    return Promise.resolve()
  }

  const links = getPageLinks(currentUrl, content)

  /* The pattern here consists in starting the spider() tasks all at once in the links.map() loop. 
  At the same time, each Promise returned by invoking spider() is collected in the final promises array.
  The critical difference in this loop—as compared to the sequential iteration loop—is that 
  we are not waiting for the previous spider() task in the list to complete before starting a new one. 
  All the spider() tasks are started in the loop at once, in the same event loop cycle. */
  const promises = links
    .map(link => spider(link, nesting - 1))

  return Promise.all(promises)
}

// Note: For a ready-to-use, production-ready implementation of a map() function supporting promises and limited concurrency, 
// you can rely on the p-map package. Find out more at nodejsdp.link/p-map


const spidering = new Set()
export function spider (url, nesting) {
  if (spidering.has(url)) {
    return Promise.resolve()
  }
  spidering.add(url)

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
