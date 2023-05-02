require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const chance  = require('chance').Chance()

describe('Given user has no cart', () => {
  it('Should return 200 with new cart when we invoke add-item', async () => {
    const userId = chance.guid()
    const item = { name: 'apple', count: 2 }
    const res = await when.we_invoke_add_item(userId, item)

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

describe('Given user has an existing cart', () => {
  const userId = chance.guid()

  beforeAll(async () => {
    await given.user_has_a_cart(userId, [{ name: 'orange', count: 3 }])
  })

  it('Should return 200 with updated cart when we invoke add-item', async () => {
    const item = { name: 'apple', count: 2 }
    const res = await when.we_invoke_add_item(userId, item)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      userId,
      items: [{
        name: 'orange',
        count: 3
      }, {
        name: 'apple',
        count: 2
      }]
    })
  })
})