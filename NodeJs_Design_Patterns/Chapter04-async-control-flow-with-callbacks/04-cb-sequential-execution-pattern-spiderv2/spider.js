import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'

// what happens if we want to execute an asynchronous operation for each item in a collection? 
// In cases such as this, we can't hardcode the task sequence anymore; instead, we have to build it dynamically.


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

/** for recursively downloading the links of a page */
function spiderLinks (currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Remember Zalgo?
    return process.nextTick(cb)
  }

  // We obtain the list of all the links contained in the page using the getPageLinks() function. 
  // This function returns only the links pointing to an internal destination
  const links = getPageLinks(currentUrl, body) // [1]
  if (links.length === 0) {
    return process.nextTick(cb)
  }

  // We iterate over the links using a local function called iterate(), which takes the index of the next link to analyze. 
  // In this function, the first thing we do is check whether the index is equal to the length of the links array,
  // in which case we immediately invoke the cb() function, as it means we have processed all the items.

  /** (4.2) sequential execution pattern: iterate over a collection while applying an asynchronous operation */
  function iterate (index) { // [2]
    if (index === links.length) {
      return cb()
    }

    // At this point, everything should be ready for processing the link. 
    // We invoke the spider() function by decreasing the nesting level and 
    // invoking the next step of the iteration when the operation completes.
    spider(links[index], nesting - 1, function (err) { // [3]
      if (err) {
        return cb(err)
      }
      iterate(index + 1)
    })
  }

  // As the last step in the spiderLinks() function, we bootstrap the iteration by invoking iterate(0).
  iterate(0) // [4]
}

export function spider (url, nesting, cb) {
  const filename = urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err)
        }

        spiderLinks(url, requestContent, nesting, cb)
      })
    }

    // The file already exists, let’s process the links
    spiderLinks(url, fileContent, nesting, cb)
  })
}
  