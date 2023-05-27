require('../../steps/init')
const messages = require('../../lib/messages')
const when = require('../../steps/when')
const Chance = require('chance')
const chance = new Chance()

describe('Given a DynamoDB event is received', () => {
  let listener

  beforeAll(async () => {    
    const target = `eventbridge-${process.env.EVENT_BUS}`
    listener = messages.startListening(target)      
  })

  afterAll(() => {
    listener.stop()
  })

  describe('When the DynamoDB event is INSERT', () => {
    const newImage = {
      id: chance.guid(),
      source: chance.string({ length: 16 }),
      message: chance.string({ length: 16 })
    }

    beforeAll(async () => {
      await when.we_invoke_dynamodb('INSERT', newImage)
    })

    it('Should send an event to EventBridge', async () => {
      const message = await listener.waitForMessage(x =>
        x.source === 'dynamodb-function' && 
        x['detail-type'] === 'greeting' &&
        x.detail.message === 'dynamodb function says hello'
      )
  
      expect(message).not.toBeNull()
    })
  })

  describe('When the DynamoDB event is MODIFY', () => {
    const newImage = {
      id: chance.guid(),
      source: chance.string({ length: 16 }),
      message: chance.string({ length: 16 })
    }
    const oldImage = {
      id: chance.guid(),
      source: chance.string({ length: 16 }),
      message: chance.string({ length: 16 })
    }

    beforeAll(async () => {
      await when.we_invoke_dynamodb('MODIFY', newImage, oldImage)
    })

    it('Should send an event to EventBridge', async () => {
      const message = await listener.waitForMessage(x =>
        x.source === 'dynamodb-function' && 
        x['detail-type'] === 'greeting' &&
        x.detail.message === 'dynamodb function says hello, again'
      )
  
      expect(message).not.toBeNull()
    })
  })

  describe('When the DynamoDB event is REMOVE', () => {
    const oldImage = {
      id: chance.guid(),
      source: chance.string({ length: 16 }),
      message: chance.string({ length: 16 })
    }

    beforeAll(async () => {
      await when.we_invoke_dynamodb('REMOVE', null, oldImage)
    })

    it('Should send an event to EventBridge', async () => {
      const message = await listener.waitForMessage(x =>
        x.source === 'dynamodb-function' && 
        x['detail-type'] === 'bye' &&
        x.detail.message === 'dynamodb function says good bye'
      )
  
      expect(message).not.toBeNull()
    })
  })
})
