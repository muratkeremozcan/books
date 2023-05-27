require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')
const chance = require('chance').Chance()

describe('Given at least one restaurant is in the database', () => {
  const restaurant = {
    id: chance.guid(),
    name: chance.string({ length: 16 })
  }

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb(restaurant)
  })

  describe('Given an authenticated user', () => {
    let user
    beforeAll(async () => {
      user = await given.an_authenticated_user()
    })
    
    it('GET /restaurants should return at least one restaurant', async () => {
      const result = await when.we_invoke_list_restaurants_remotely(user, 1)

      expect(result.statusCode).toEqual(200)
      expect(result.body.restaurants).toHaveLength(1)
    })
  })
})