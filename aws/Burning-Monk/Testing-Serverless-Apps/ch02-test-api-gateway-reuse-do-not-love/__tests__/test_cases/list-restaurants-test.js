/**
 * List-Restaurants test
 * 
 * @group integration
 * @group e2e
 */

require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const chance = require('chance').Chance()

const { TEST_MODE } = process.env

describe('Given at least one restaurant is in the database', () => {
  const restaurant = {
    id: chance.guid(),
    name: chance.string({ length: 16 })
  }
  let user

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb(restaurant)

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })
    
  it('GET /restaurants should return at least one restaurant', async () => {
    const result = await when.we_invoke_list_restaurants(1, null, user)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
  })
})

describe('Given at least two restaurants in the database', () => {
  let user

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })

    await given.restaurant_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })

  it('list-restaurants with count of 1 should return a nextToken', async () => {
    const result = await when.we_invoke_list_restaurants(1, null, user)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    expect(result.body.nextToken).not.toBeUndefined()
  })

  it ('list-restaurants can paginate with nextToken', async () => {
    const result1 = await when.we_invoke_list_restaurants(1, null, user)
    const { nextToken } = result1.body
    const result2 = await when.we_invoke_list_restaurants(1, nextToken, user)
    expect(result2.statusCode).toEqual(200)
    expect(result2.body.restaurants).toHaveLength(1)
    
    const restaurant1 = result1.body.restaurants[0]
    const restaurant2 = result2.body.restaurants[0]
    expect(restaurant1.id).not.toEqual(restaurant2.id)
  })
})