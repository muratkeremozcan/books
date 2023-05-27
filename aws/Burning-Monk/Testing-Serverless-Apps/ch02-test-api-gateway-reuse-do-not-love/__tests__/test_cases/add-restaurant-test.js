/**
 * Add-Restaurant test
 * 
 * @group integration
 * @group e2e
 */

require('../steps/init')
const when = require('../steps/when')
const then = require('../steps/then')
const chance = require('chance').Chance()

describe('Given an authorized IAM user', () => {
  const restaurantName = chance.string({ length: 16 })
  let restaurantId

  it('POST /restaurants should add a restaurant', async () => {
    const restaurant = { name: restaurantName }
    const result = await when.we_invoke_add_restaurant(restaurant)
    
    expect(result.statusCode).toEqual(200)
    expect(result.body.id).not.toBeNull()
    expect(result.body).toMatchObject(restaurant)

    restaurantId = result.body.id
    await then.restaurant_exists_in_dynamodb(restaurantId)
  })
})