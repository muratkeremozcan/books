import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

// much shorter, no nesting with async await
async function download (url, filename) {
  console.log(`Downloading ${url}`)
  const { text: content } = await superagent.get(url)

  await mkdirpPromises(dirname(filename))
  await fsPromises.writeFile(filename, content)

  console.log(`Downloaded and saved: ${url}`)
  return content
}

async function spiderLinks (currentUrl, content, nesting) {
  if (nesting === 0) {
    return
  }
  const links = getPageLinks(currentUrl, content)

  // simple iteration over a list of links 
  // for each item we await on the Promise returned by spider().
  for (const link of links) {
    await spider(link, nesting - 1)
  }

  /* NOTE: it is an anti-pattern to try to use Array.forEach() or Array.map() 
   to implement a sequential asynchronous iteration with async/await

  links.forEach(async function iteration(link) {
    await spider(link, nesting - 1)
  })
  */
}

export async function spider (url, nesting) {
  const filename = urlToFilename(url)
  let content
  
  // The aspect to notice here is how errors are easily dealt with 
  // using just a try...catch statement
  try {
    content = await fsPromises.readFile(filename, 'utf8')
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }

    content = await download(url, filename)
  }

  return spiderLinks(url, content, nesting)
}
