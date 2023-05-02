require('../../steps/init')
const when = require('../../steps/when')
const given = require('../../steps/given')
const chance = require('chance').Chance()

describe('Given a restaurant in the database', () => {
  const name = chance.string({ length: 16 })
  const id = chance.guid()

  beforeAll(async () => {
    await given.restaurant_exists_in_dynamodb({
      id,
      name
    })
  })

  it('search-restaurants should find the restaurant by name', async () => {
    const result = await when.we_invoke_search_restaurants(name)

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    expect(result.body.restaurants[0].id).toEqual(id)
  })

  it('search-restaurants should find the restaurant by name prefix', async () => {
    const result = await when.we_invoke_search_restaurants(name.substring(0, 10))

    expect(result.statusCode).toEqual(200)
    expect(result.body.restaurants).toHaveLength(1)
    expect(result.body.restaurants[0].id).toEqual(id)
  })

  it('search-restaurants should return 400 if name is bull', async () => {
    const result = await when.we_invoke_search_restaurants(null)

    expect(result.statusCode).toEqual(400)
  })

  it('search-restaurants should return 400 if name is missing', async () => {
    const result = await when.we_invoke_search_restaurants(undefined)

    expect(result.statusCode).toEqual(400)
  })

  it('search-restaurants should return 400 if name is empty', async () => {
    const result = await when.we_invoke_search_restaurants("")

    expect(result.statusCode).toEqual(400)
  })
})