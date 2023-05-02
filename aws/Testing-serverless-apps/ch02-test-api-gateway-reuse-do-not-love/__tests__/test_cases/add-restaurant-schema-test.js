/**
 * Add-Restaurant schema validation test
 * 
 * @group e2e
 */

require('../steps/init')
const when = require('../steps/when')

describe('Given an authorized IAM user', () => {
  it('POST /restaurants should return 400 if "name" is missing', async () => {
    const result = await when.we_invoke_add_restaurant({ })

    expect(result.statusCode).toEqual(400)
  })

  it('POST /restaurants should return 400 if "name" is null', async () => {
    const result = await when.we_invoke_add_restaurant({ name: null })

    expect(result.statusCode).toEqual(400)
  })
})