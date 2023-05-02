require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()

describe('Given a valid restaurant', () => {
  const restaurant = {
    name: chance.string({ length: 16 })
  }

  it('add-restaurant should add the new restaurant to the Restaurants table', async () => {
    const result = await when.we_invoke_add_restaurant(restaurant)

    expect(result.statusCode).toEqual(200)
    expect(result.body.id).not.toBeNull()
    expect(result.body).toMatchObject(restaurant)

    await then.restaurant_exists_in_dynamodb(result.body.id)
  })
})