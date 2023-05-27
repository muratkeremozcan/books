require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')
const chance = require('chance').Chance()

describe('Given a restaurant is in the database', () => {
  const restaurant = {
    id: chance.guid(),
    name: chance.string({ length: 16 })
  }

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb(restaurant)
  })

  it('GET /restaurant/{id} returns the restaurant', async () => {
    const result = await when.we_invoke_get_restaurant_remotely(restaurant.id)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toMatchObject(restaurant)
  })

  it('GET /restaurant/{id} returns 404 for non-existent restaurant id', async () => {
    const result = await when.we_invoke_get_restaurant_remotely(chance.guid())
    expect(result.statusCode).toEqual(404)
  })
})