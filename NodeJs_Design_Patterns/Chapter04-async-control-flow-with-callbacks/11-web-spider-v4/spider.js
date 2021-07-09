import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'

function saveFile (filename, contents, cb) {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(filename, contents, cb)
  })
}

function download (url, filename, cb) {
  console.log(`Downloading ${url}`)
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveFile(filename, res.text, err => {
      if (err) {
        return cb(err)
      }
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}

/** invokes the new spider() function to push a new task to the queue, one for each discovered link */
function spiderLinks (currentUrl, body, nesting, queue) {
  if (nesting === 0) {
    return
  }

  const links = getPageLinks(currentUrl, body)
  if (links.length === 0) {
    return
  }

  links.forEach(link => spider(link, nesting - 1, queue))
}

// The function signature now accepts a new parameter called queue. 
// This is an instance of TaskQueue that we need to carry over to be able to append new tasks when necessary
function spiderTask (url, nesting, queue, cb) {
  const filename = urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err)
        }
        // The function responsible for adding new links to crawl is spiderLinks, 
        // so we need to make sure that we pass the queue instance when we call this function after downloading a new page
        spiderLinks(url, requestContent, nesting, queue)
        return cb()
      })
    }

    // We also need to pass the queue instance to spiderLinks when we are invoking that from an already downloaded file.
    spiderLinks(url, fileContent, nesting, queue)
    return cb()
  })
}

const spidering = new Set()

// needs to act as the entry point for the first URL; it will also be used to add every new discovered URL to the queue:
export function spider (url, nesting, queue) {
  if (spidering.has(url)) {
    return
  }

  spidering.add(url)
  
  queue.pushTask((done) => {
    spiderTask(url, nesting, queue, done)
  })
}
