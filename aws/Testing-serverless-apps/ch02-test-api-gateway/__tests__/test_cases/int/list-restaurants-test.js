require('../../steps/init')
const when = require('../../steps/when')
const given = require('../../steps/given')
const chance = require('chance').Chance()

describe('Given at least one restaurant in the database', () => {
  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })
  })

  it('list-restaurants with count of 1 should return exactly one restaurant', async () => {
    const result = await when.we_invoke_list_restaurants(1)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
  })
})

describe('Given at least two restaurants in the database', () => {
  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })

    await given.restaurant_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })
  })

  it('list-restaurants with count of 1 should return a nextToken', async () => {
    const result = await when.we_invoke_list_restaurants(1)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    expect(result.body.nextToken).not.toBeUndefined()
  })

  it ('list-restaurants can paginate with nextToken', async () => {
    const result1 = await when.we_invoke_list_restaurants(1)
    const { nextToken } = result1.body
    const result2 = await when.we_invoke_list_restaurants(1, nextToken)
    expect(result2.statusCode).toEqual(200)
    expect(result2.body.restaurants).toHaveLength(1)
    
    const restaurant1 = result1.body.restaurants[0]
    const restaurant2 = result2.body.restaurants[0]
    expect(restaurant1.id).not.toEqual(restaurant2.id)
  })
})