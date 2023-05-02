require('../../steps/init')
const when = require('../../steps/when')
const Chance = require('chance')
const chance = new Chance()
const AWS = require('aws-sdk')
const mockPut = jest.fn()
AWS.DynamoDB.DocumentClient.prototype.put = mockPut
const mockPublish = jest.fn()
AWS.SNS.prototype.publish = mockPublish

describe('When an EventBridge request is received', () => {
  const id = chance.guid()
  const message = chance.string({ length: 16 })
  const source = chance.string({ length: 16 })

  beforeAll(async () => {
    mockPut.mockReturnValue({
      promise: async () => {}
    })
    mockPublish.mockReturnValue({
      promise: async () => {}
    })

    await when.we_invoke_eventbridge(id, message, source)
  })

  afterAll(() => {
    mockPut.mockClear()
    mockPublish.mockClear()
  })

  it('Should save data in DynamoDB', async () => {
    expect(mockPut).toBeCalledTimes(1)
    expect(mockPut).toBeCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id,
        source,
        message
      }
    })
  })

  it('Should send a message to SNS', async () => {
    expect(mockPublish).toBeCalledTimes(1)
    expect(mockPublish).toBeCalledWith({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: 'eventbridge function says hello',
      MessageAttributes: {
        id: {
          DataType: 'String',
          StringValue: id
        }
      }
    })
  })
})
