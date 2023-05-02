require('../../steps/init')
const when = require('../../steps/when')
const chance = require('chance').Chance()

describe('Given an authorized IAM user', () => {
  const restaurantName = chance.string({ length: 16 })
  let restaurantId

  it('POST /restaurants should add a restaurant', async () => {
    const restaurant = { name: restaurantName }
    const result = await when.we_invoke_add_restaurant_remotely(restaurant)
    
    expect(result.statusCode).toEqual(200)
    expect(result.body.id).not.toBeNull()
    expect(result.body).toMatchObject(restaurant)

    restaurantId = result.body.id
  })

  it('POST /restaurants should return 400 if "name" is missing', async () => {
    const result = await when.we_invoke_add_restaurant_remotely({ })

    expect(result.statusCode).toEqual(400)
  })

  it('POST /restaurants should return 400 if "name" is null', async () => {
    const result = await when.we_invoke_add_restaurant_remotely({ name: null })

    expect(result.statusCode).toEqual(400)
  })
})