const given = require('../steps/given')
const when = require('../steps/when')
const chance = require('chance').Chance()
const retry = require('async-retry')

jest.setTimeout(10000)

describe('Given user B follows user A', () => {
  let userA, userB
  beforeAll(async () => {
    userA = await given.an_authenticated_user()
    userB = await given.an_authenticated_user()
    await when.a_user_calls_follow(userB, userA.username)
  })

  describe('When user A sends a tweet', () => {
    let tweet
    const text = chance.string({ length: 16 })
    beforeAll(async () => {
      tweet = await when.a_user_calls_tweet(userA, text)
    })

    it('Should return the new tweet', () => {
      expect(tweet).toMatchObject({
        text,
      })
    })

    it("Should appear in user A's own timeline", async () => {
      await retry(async () => {
        const { tweets } = await when.a_user_calls_getMyTimeline(userA, 25)
  
        expect(tweets).toHaveLength(1)
        expect(tweets).toEqual([
          expect.objectContaining({
            id: tweet.id,
            text
          }),
        ])
      }, {
        retries: 3,
        maxTimeout: 1000
      })
    })

    it("Should appear in user B's timeline", async () => {
      await retry(async () => {
        const { tweets } = await when.a_user_calls_getMyTimeline(userB, 25)
  
        expect(tweets).toHaveLength(1)
        expect(tweets).toEqual([
          expect.objectContaining({
            id: tweet.id,
            text
          }),
        ])
      }, {
        retries: 3,
        maxTimeout: 1000
      })
    })
  })
})