require('../../steps/init')
const messages = require('../../lib/messages')
const when = require('../../steps/when')
const then = require('../../steps/then')
const Chance = require('chance')
const chance = new Chance()

describe('When an EventBridge request is received', () => {
  let listener
  const id = chance.guid()
  const message = chance.string({ length: 16 })
  const source = chance.string({ length: 16 })

  beforeAll(async () => {    
    const target = `sns-${process.env.SnsTopicName}`
    listener = messages.startListening(target)

    await when.we_invoke_eventbridge(id, message, source)
  })

  afterAll(() => {
    listener.stop()
  })

  it('Should save data in DynamoDB', async () => {
    const row = await then.a_row_exists_in_dynamodb(id)
    expect(row.source).toEqual(source)
  })

  it('Should send an event to SNS', async () => {
    const message = await listener.waitForMessage(x => 
      x.Message === 'eventbridge function says hello'
    )

    expect(message).not.toBeNull()
  })
})
