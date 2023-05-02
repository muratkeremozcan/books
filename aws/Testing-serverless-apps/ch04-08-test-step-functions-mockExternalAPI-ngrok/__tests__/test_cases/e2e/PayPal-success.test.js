require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()
const webserver = require('../../lib/webserver')
const retry = require('async-retry')

describe('Test case: PayPal returns 200 COMPLETED', () => {
  const authorizationId = chance.guid()
  const paymentId = chance.guid()
  let mockApi

  beforeAll(async () => {
    mockApi = await webserver.start({
      captureAuthorizedPayment: (req, res, next) => {
        res.send({ 
          id: paymentId,
          status: "COMPLETED",
        })

        console.log('sent PayPal success response')
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
        await then.execution_status_is(executionArn, 'SUCCEEDED')        
      }, {
        retries: 3,
        maxTimeout: 1000
      })
    })

    it('Should return the payment id', async () => {
      await retry(async () => {
        await then.execution_output_is(executionArn, { 
          success: true,
          response: {
            id: paymentId,
            status: "COMPLETED",
          }
        })
      }, {
        retries: 3,
        minTimeout: 1000
      })
    })
  })
})