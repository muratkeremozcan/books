/**
 * Search-Restaurants test
 * 
 * @group integration
 * @group e2e
 */

require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const chance = require('chance').Chance()

describe('Given a restaurant is in the database', () => {
  const restaurant = {
    id: chance.guid(),
    name: chance.string({ length: 16 })
  }

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb(restaurant)
  })

  it('POST /search should find the restaurant by name', async () => {
    const result = await when.we_invoke_search_restaurants(restaurant.name)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    const match = result.body.restaurants[0]
    expect(match).toEqual(restaurant)
  })

  it('POST /search should find the restaurant by name prefix', async () => {
    const result = await when.we_invoke_search_restaurants(
      restaurant.name.substring(0, 10))

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    const match = result.body.restaurants[0]
    expect(match).toEqual(restaurant)
  })

  it('POST /search should return 400 if name is null', async () => {
    const result = await when.we_invoke_search_restaurants(null)

    expect(result.statusCode).toEqual(400)
  })

  it('POST /search should return 400 if name is undefined', async () => {
    const result = await when.we_invoke_search_restaurants()

    expect(result.statusCode).toEqual(400)
  })

  it('POST /search should return 400 if name is empty', async () => {
    const result = await when.we_invoke_search_restaurants("")

    expect(result.statusCode).toEqual(400)
  })
})