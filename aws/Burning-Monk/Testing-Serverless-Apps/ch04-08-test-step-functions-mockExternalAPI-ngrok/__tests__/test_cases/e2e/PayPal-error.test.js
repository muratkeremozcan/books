require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()
const webserver = require('../../lib/webserver')
const retry = require('async-retry')

describe('Test case: PayPal returns 400 error', () => {
  const authorizationId = chance.guid()
  let mockApi

  beforeAll(async () => {
    mockApi = await webserver.start({
      captureAuthorizedPayment: (req, res, next) => {
        res.status(400)

        console.log('sent PayPal 400 response')
        next()
      }
    })
  })

  afterAll(async () => await mockApi.stop())
  
  describe('When we start an execution', () => {
    let executionArn

    beforeAll(async () => {
      executionArn = await when.we_start_execution(
        process.env.StateMachineArn, 
        { 
          authorizationId,
          amount: 300,
          invoiceId: chance.guid(),
          requestId: chance.guid(),
          overridePaypalUrl: mockApi.url
        })
    })

    it('Should complete successfully', async () => {
      await retry(async () => {
        await then.execution_status_is(executionArn, 'FAILED')        
      }, {
        retries: 3,
        maxTimeout: 1000
      })
    })
  })
})