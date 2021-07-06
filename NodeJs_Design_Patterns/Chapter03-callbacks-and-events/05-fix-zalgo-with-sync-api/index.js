import { readFileSync } from 'fs'

const cache = new Map()

// (3.1) always choose direct style for purely synchronous functions

function consistentReadSync (filename) {
  if (cache.has(filename)) {
    return cache.get(filename)
  } else {
    const data = readFileSync(filename, 'utf8')
    cache.set(filename, data)
    return data
  }
}

console.log(consistentReadSync('data.txt'))
// the next call will read from the cache
console.log(consistentReadSync('data.txt'))
