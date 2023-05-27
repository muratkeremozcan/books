require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const messages = require('../../lib/messages')
const chance = require('chance').Chance()
const retry = require('async-retry')

describe("Test case: restaurant doesn't respond to the order in time", () => {
  const orderId = chance.guid()

  beforeAll(() => {
    messages.startListening()
  })

  afterAll(() => {
    messages.stopListening()
  })

  describe('Given a local instance of the state machine', () => {
    let stateMachineArn

    beforeAll(async () => {
      stateMachineArn = await given.a_local_statemachine_instance(
        process.env.StateMachineArn,
        chance.guid(),
        (definitionJson) => {
          const definition = JSON.parse(definitionJson)
          definition.States['Notify restaurant'].TimeoutSeconds = 1
          return JSON.stringify(definition)
        }
      )
    })

    describe('When we start a local execution', () => {
      let executionArn
  
      beforeAll(async () => {
        executionArn = await when.we_start_local_execution(
          stateMachineArn, 
          { orderId })
      })
  
      it('Should add the order to the database', async () => {
        await then.an_order_exists_in_dynamodb(orderId)
      })
  
      it('Should send a SNS notification to the restaurant topic', async () => {
        const restaurantNotification = await then.a_restaurant_notification_is_received(orderId)
        expect(restaurantNotification.TaskToken).toBeTruthy()
      })

      it('Should update the order status to "NO_RESPONSE"', async () => {
        await retry(async () => {
          const order = await then.an_order_exists_in_dynamodb(orderId)
          expect(order.status).toEqual("NO_RESPONSE")
        }, {
          retries: 3,
          maxTimeout: 1000
        })
      })
    })
  })
})