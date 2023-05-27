require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const chance  = require('chance').Chance()

describe('Given user has no cart', () => {
  it('Should return 200 with null body when we invoke get-cart', async () => {
    const userId = chance.guid()
    const res = await when.we_invoke_get_cart(userId)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeNull()
  })
})

describe('Given user has an existing cart', () => {
  const userId = chance.guid()

  beforeAll(async () => {
    await given.user_has_a_cart(userId, [{ name: 'apple', count: 2 }])
  })

  it('Should return 200 with cart when we invoke get-cart', async () => {
    const res = await when.we_invoke_get_cart(userId)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      userId,
      items: [{
        name: 'apple',
        count: 2
      }]
    })
  })
})