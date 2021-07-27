import { totalSales as totalSalesRaw } from './totalSales.js'

const CACHE_TTL = 30 * 1000 // 30 seconds TTL
const cache = new Map()

export function totalSales (product) {
  if (cache.has(product)) {
    console.log('Cache hit')
    return cache.get(product)
  }

  const resultPromise = totalSalesRaw(product)
  cache.set(product, resultPromise)
  // Adding a caching layer to our batching API is straightforward, thanks to promises. 
  // All we have to do is leave the promise in our request map, even after the request has completed.
  // All we have to do is remove the promise from the cache after a certain time (CACHE_TTL) after
  // the request has completed, or immediately if the request has failed.
  resultPromise.then(() => {
    setTimeout(() => {
      cache.delete(product)
    }, CACHE_TTL)
  }, err => {
    cache.delete(product)
    throw err
  })

  return resultPromise
}
