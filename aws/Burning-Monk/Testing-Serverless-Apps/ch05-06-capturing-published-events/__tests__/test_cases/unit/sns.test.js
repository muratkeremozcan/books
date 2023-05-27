require('../../steps/init')
const when = require('../../steps/when')
const Chance = require('chance')
const chance = new Chance()
const AWS = require('aws-sdk')
const mockGet = jest.fn()
AWS.DynamoDB.DocumentClient.prototype.get = mockGet
const mockUpdate = jest.fn()
AWS.DynamoDB.DocumentClient.prototype.update = mockUpdate

describe('Given an id exists in DynamoDB', () => {
  const id = chance.guid()
  const source = chance.string({ length: 16 })
  const message = chance.string({ length: 16 })

  beforeAll(async () => {
    mockGet.mockReturnValue({
      promise: async () => ({
        Item: {
          id,
          source,
          message
        }
      })
    })
    mockUpdate.mockReturnValue({
      promise: async () => {}
    })
  })

  afterAll(() => {
    mockGet.mockClear()
    mockUpdate.mockClear()
  })

  describe('When a SNS request is received', () => {
    beforeAll(async () => {
      await when.we_invoke_sns(id, message)
    })

    it('Should have called getItem', async () => {
      expect(mockGet).toBeCalledTimes(1)
      expect(mockGet).toBeCalledWith({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id
        }
      })
    })

    it('Should have called update', async () => {
      expect(mockUpdate).toBeCalledTimes(1)
      expect(mockUpdate).toBeCalledWith({
        TableName: process.env.DYNAMODB_TABLE,
        UpdateExpression: 'SET ending = :ending',
        Key: {
          id
        },
        ExpressionAttributeValues: {
          ':ending': `${message}, and the sns function says good bye`
        }
      })
    })
  })
})

describe('Given an id does not exists in DynamoDB', () => {
  const id = chance.guid()
  const message = chance.string({ length: 16 })

  beforeAll(async () => {
    mockGet.mockReturnValue({
      promise: async () => ({
        Item: null
      })
    })
    mockUpdate.mockReturnValue({
      promise: async () => {}
    })
  })

  afterAll(() => {
    mockGet.mockClear()
    mockUpdate.mockClear()
  })

  describe('When a SNS request is received', () => {
    beforeAll(async () => {
      await when.we_invoke_sns(id, message)
    })

    it('Should have called getItem', async () => {
      expect(mockGet).toBeCalledTimes(1)
      expect(mockGet).toBeCalledWith({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id
        }
      })
    })

    it('Should not have called update', async () => {
      expect(mockUpdate).toBeCalledTimes(0)
    })
  })
})
