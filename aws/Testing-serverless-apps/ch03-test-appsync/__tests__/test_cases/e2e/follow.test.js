require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')

describe('Given authenticated users, user A and B', () => {
  let userA, userB
  beforeAll(async () => {
    userA = await given.an_authenticated_user()
    userB = await given.an_authenticated_user()
  })

  describe("When user A follows user B", () => {
    beforeAll(async () => {
      await when.a_user_calls_follow(userA, userB.username)
    })

    it("User A should see himself in user B's list of followers", async () => {
      const { profiles } = await when.a_user_calls_getFollowers(userA, userB.username, 25)

      expect(profiles).toHaveLength(1)
      expect(profiles[0]).toMatchObject({
        id: userA.username
      })
    })
  })

  describe("When user B follows user A back", () => {
    beforeAll(async () => {
      await when.a_user_calls_follow(userB, userA.username)
    })

    it("User A should user B in his list of followers", async () => {
      const { profiles } = await when.a_user_calls_getFollowers(userA, userA.username, 25)

      expect(profiles).toHaveLength(1)
      expect(profiles[0]).toMatchObject({
        id: userB.username
      })
    })
  })
})