import superagent from 'superagent'

export class CheckUrls {
  constructor (urls) {
    this.urls = urls
  }

  // Interestingly, using an async generator in place of a bare async iterator 
  // allowed us to save a few lines of code and the resulting logic is also more readable and explicit
  async * [Symbol.asyncIterator] () {
    for (const url of this.urls) {
      try {
        const checkResult = await superagent
          .head(url)
          .redirects(2)
        yield `${url} is up, status: ${checkResult.status}`
      } catch (err) {
        yield `${url} is down, error: ${err.message}`
      }
    }
  }
}
