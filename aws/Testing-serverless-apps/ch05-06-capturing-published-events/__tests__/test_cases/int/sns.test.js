require('../../steps/init')
const when = require('../../steps/when')
const given = require('../../steps/given')
const then = require('../../steps/then')
const Chance = require('chance')
const chance = new Chance()

describe('Given an id exists in DynamoDB', () => {
  const id = chance.guid()
  const source = chance.string({ length: 16 })
  const message = chance.string({ length: 16 })

  beforeAll(async () => {
    await given.a_row_exists_in_dynamodb(id, source, message)
  })

  describe('When a SNS request is received', () => {
    beforeAll(async () => {
      await when.we_invoke_sns(id, message)
    })

    it('Should add ending to DynamoDB row', async () => {
      const row = await then.a_row_exists_in_dynamodb(id)
      expect(row.ending).toEqual(`${message}, and the sns function says good bye`)
    })
  })
})

describe('Given an id does not exist in DynamoDB', () => {
  const id = chance.guid()
  const message = chance.string({ length: 16 })

  describe('When a SNS request is received', () => {
    beforeAll(async () => {
      await when.we_invoke_sns(id, message)
    })

    it('Should not add item to DynamoDB', async () => {
      await then.a_row_does_not_exist_in_dynamodb(id)
    })
  })
})
