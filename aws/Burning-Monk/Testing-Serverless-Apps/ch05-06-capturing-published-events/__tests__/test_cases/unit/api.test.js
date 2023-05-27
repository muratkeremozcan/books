require('../../steps/init')
const when = require('../../steps/when')
const AWS = require('aws-sdk')
const mockPutEvents = jest.fn()
AWS.EventBridge.prototype.putEvents = mockPutEvents

describe('When a HTTP POST request is received', () => {
  let httpResp

  beforeAll(async () => {
    mockPutEvents.mockReturnValue({
      promise: async () => {}
    })

    httpResp = await when.we_invoke_api()
  })

  afterAll(() => mockPutEvents.mockClear())

  it('Should return a HTTP 202', () => {
    expect(httpResp.statusCode).toEqual(202)
  })

  it('Should send an event to EventBridge', async () => {
    expect(mockPutEvents).toBeCalledTimes(1)
    expect(mockPutEvents).toBeCalledWith({
      Entries: [
        expect.objectContaining({
          Source: 'api-function',
          DetailType: 'greeting',
          EventBusName: process.env.EVENT_BUS
        })
      ]
    })

    const req = mockPutEvents.mock.calls[0][0]
    const entry = req.Entries[0]
    const detail = JSON.parse(entry.Detail)
    expect(detail.id).toBeTruthy()
    expect(detail.message).toEqual('api function says hello')
  })
})
