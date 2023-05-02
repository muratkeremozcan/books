require('../../steps/init')
const when = require('../../steps/when')
const Chance = require('chance')
const chance = new Chance()
const AWS = require('aws-sdk')
const mockPutEvents = jest.fn()
AWS.EventBridge.prototype.putEvents = mockPutEvents

describe('Given a DynamoDB event is received', () => {

  beforeAll(() => 
    mockPutEvents.mockReturnValue({
      promise: async () => {}
    })
  )

  afterEach(() => mockPutEvents.mockClear())

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
      expect(mockPutEvents).toBeCalledTimes(1)
      expect(mockPutEvents).toBeCalledWith({
        Entries: [
          expect.objectContaining({
            EventBusName: process.env.EVENT_BUS,
            Source: 'dynamodb-function',
            DetailType: 'greeting',
          })
        ]
      })
      const req = mockPutEvents.mock.calls[0][0]
      const entry = req.Entries[0]
      const detail = JSON.parse(entry.Detail)
      expect(detail.id).toBeTruthy()
      expect(detail.message).toEqual('dynamodb function says hello')
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
      expect(mockPutEvents).toBeCalledTimes(1)
      expect(mockPutEvents).toBeCalledWith({
        Entries: [
          expect.objectContaining({
            EventBusName: process.env.EVENT_BUS,
            Source: 'dynamodb-function',
            DetailType: 'greeting',
          })
        ]
      })
      const req = mockPutEvents.mock.calls[0][0]
      const entry = req.Entries[0]
      const detail = JSON.parse(entry.Detail)
      expect(detail.id).toBeTruthy()
      expect(detail.message).toEqual('dynamodb function says hello, again')
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
      expect(mockPutEvents).toBeCalledTimes(1)
      expect(mockPutEvents).toBeCalledWith({
        Entries: [
          expect.objectContaining({
            EventBusName: process.env.EVENT_BUS,
            Source: 'dynamodb-function',
            DetailType: 'bye',
          })
        ]
      })
      const req = mockPutEvents.mock.calls[0][0]
      const entry = req.Entries[0]
      const detail = JSON.parse(entry.Detail)
      expect(detail.id).toBeTruthy()
      expect(detail.message).toEqual('dynamodb function says good bye')
    })
  })
})
