import { totalSales as totalSalesRaw } from './totalSales.js'

const runningRequests = new Map()

// The behavior of the new totalSales() function is identical to that of the original totalSales() API, 
// with the difference that, now, multiple calls to the API using the same input are batched, thus saving us time and resources.

export function totalSales (product) {
  // If a promise for the given product already exists, we just return it. 
  // This is where we piggyback on an already running request.
  if (runningRequests.has(product)) {
    console.log('Batching')
    return runningRequests.get(product)
  }

  // If there is no request running for the given product, we execute the original totalSales() function 
  // and we save the resulting promise into the runningRequests map. 
  // Next, we make sure to remove the same promise from the runningRequests map as soon as the request completes.
  const resultPromise = totalSalesRaw(product)
  runningRequests.set(product, resultPromise)
  resultPromise.finally(() => {
    runningRequests.delete(product)
  })

  return resultPromise
}
