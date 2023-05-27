require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()

describe('Given an authenticated user', () => {
  let user
  beforeAll(async () => {
    user = await given.an_authenticated_user()
  })

  describe('When the user sends a tweet', () => {
    let tweet
    const text = chance.string({ length: 16 })
    beforeAll(async () => {
      tweet = await when.we_invoke_tweet(user.username, text)
    })

    it('Saves the tweet in the Tweets table', async () => {
      const ddbTweet = await then.tweet_exists_in_TweetsTable(tweet.id)
      expect(ddbTweet.text).toEqual(text)
    })
  })
})