require('../../steps/init')
const messages = require('../../lib/messages')
const when = require('../../steps/when')

describe('When a HTTP POST request is received', () => {
  let httpResp, listener

  beforeAll(async () => {    
    const target = `eventbridge-${process.env.EVENT_BUS}`
    listener = messages.startListening(target)
    
    httpResp = await when.we_invoke_api()
  })

  afterAll(() => {
    listener.stop()
  })

  it('Should return a HTTP 202', () => {
    expect(httpResp.statusCode).toEqual(202)
  })

  it('Should send an event to EventBridge', async () => {
    const message = await listener.waitForMessage(x =>
      x.source === 'api-function' && x['detail-type'] === 'greeting'
    )

    expect(message.detail).toMatchObject({
      id: expect.any(String),
      message: 'api function says hello'
    })
  })
})
