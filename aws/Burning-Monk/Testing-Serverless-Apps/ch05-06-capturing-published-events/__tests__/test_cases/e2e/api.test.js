require('../../steps/init')
const messages = require('../../lib/messages')
const when = require('../../steps/when')
const then = require('../../steps/then')
const retry = require('async-retry')

jest.setTimeout(10000)

const isJson = x => {
  try {
    JSON.parse(x)
    return true
  } catch (_) {
    return false
  }
}

describe('When a HTTP POST request is received', () => {
  let httpResp, evbListener, snsListener

  beforeAll(async () => {    
    const evbTarget = `eventbridge-${process.env.EVENT_BUS}`
    evbListener = messages.startListening(evbTarget)
    const snsTarget = `sns-${process.env.SnsTopicName}`
    snsListener = messages.startListening(snsTarget)
    
    httpResp = await when.we_hit_http_endpoint('POST', '')
  })

  afterAll(() => {
    evbListener.stop()
    snsListener.stop()
  })

  it('Should return a HTTP 202', () => {
    expect(httpResp.statusCode).toEqual(202)
  })

  describe('Given the first EventBridge event is found', () => {
    let id, apiFuncGreeting

    beforeAll(async () => {
      apiFuncGreeting = await evbListener.waitForMessage(x =>
        x.source === 'api-function' && x['detail-type'] === 'greeting'
      )

      id = apiFuncGreeting?.detail?.id
    })

    it('Should say "api function says hello"', () => {
      expect(apiFuncGreeting.detail).toMatchObject({
        id,
        message: 'api function says hello'
      })
    })

    it('EventBridge should send a message to SNS', async () => {
      const message = await snsListener.waitForMessage(x => {
        if (!isJson(x.Message)) {
          return false
        }
  
        const evbMessage = JSON.parse(x.Message)
        return evbMessage.source === 'api-function' 
          && evbMessage['detail-type'] === 'greeting'
      })
  
      expect(message).not.toBeNull()
    })

    it('eventbridge-function should save some data in DynamoDB', async () => {
      const row = await then.a_row_exists_in_dynamodb(id)
      expect(row.source).not.toBeNull()
    })

    it('eventbridge-function should send a message to SNS', async () => {
      const message = await snsListener.waitForMessage(x => 
        x.Message === 'eventbridge function says hello'
      )
  
      expect(message).not.toBeNull()
    })

    it('sns-function should update the saved data in DynamoDB', async () => {
      await retry(async () => {
        const row = await then.a_row_exists_in_dynamodb(id)
        expect(row.ending).toEqual('eventbridge function says hello, and the sns function says good bye')
      }, {
        retries: 5,
        maxTimeout: 1000
      })
    })

    it('dynamodb-function should send two events to EventBridge', async () => {
      const message1 = await evbListener.waitForMessage(x =>
        x.source === 'dynamodb-function' && 
        x.detail.message === 'dynamodb function says hello'
      )
      expect(message1).not.toBeNull()

      const message2 = await evbListener.waitForMessage(x =>
        x.source === 'dynamodb-function' && 
        x.detail.message === 'dynamodb function says hello, again'
      )
      expect(message2).not.toBeNull()
    })
  })
})
