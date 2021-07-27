import superagent from 'superagent'

export class CheckUrls {
  constructor (urls) {
    this.urls = urls
  }

  [Symbol.asyncIterator] () {
    // we obtain an iterator from the this.urls object, which should be an iterable.
    // We can do that by simply invoking its @@iterable method.
    const urlsIterator = this.urls[Symbol.iterator]()

    return {
      // In the next() method, we use the urlsIterator to get the next URL in the list,
      // unless there are no more, in which case we simply return {done: true}
      async next () {
        const iteratorResult = urlsIterator.next()
        if (iteratorResult.done) {
          return { done: true }
        }

        const url = iteratorResult.value
        try {
          const checkResult = await superagent
            .head(url)
            .redirects(2)
          return {
            done: false,
            value: `${url} is up, status: ${checkResult.status}`
          }
        } catch (err) {
          return {
            done: false,
            value: `${url} is down, error: ${err.message}`
          }
        }
      }
    }
  }
}
