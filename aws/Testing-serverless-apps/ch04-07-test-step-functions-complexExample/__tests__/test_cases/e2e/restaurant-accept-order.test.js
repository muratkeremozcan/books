require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()
const messages = require('../../lib/messages')
const retry = require('async-retry')

describe('Test case: restaurant accepts the order', () => {
  const orderId = chance.guid()

  beforeAll(() => {
    messages.startListening()
  })

  afterAll(() => {
    messages.stopListening()
  })
  
  describe('When we start an execution', () => {
    let executionArn, restaurantNotification

    beforeAll(async () => {
      executionArn = await when.we_start_execution(
        process.env.StateMachineArn, 
        { orderId })
    })

    it('Should add the order to the database', async () => {
      await then.an_order_exists_in_dynamodb(orderId)
    })

    it('Should send a SNS notification to the restaurant topic', async () => {
      restaurantNotification = await then.a_restaurant_notification_is_received(orderId)
      expect(restaurantNotification.TaskToken).toBeTruthy()
    })

    describe('When we accept the order', () => {
      beforeAll(async () => {
        await when.we_accept_order(orderId, restaurantNotification.TaskToken)
      })

      it('Should update order status to "ACCEPTED"', async () => {
        const order = await then.an_order_exists_in_dynamodb(orderId)
        expect(order.status).toEqual('ACCEPTED')
      })

      it('Should save the confirmation token against the order', async () => {
        await retry(async () => {
          const order = await then.an_order_exists_in_dynamodb(orderId)
          expect(order.confirmationToken).toBeTruthy()
        }, {
          retries: 3,
          maxTimeout: 1000
        })
      })

      it('Should send a SNS notification to the user topic', async () => {
        const userNotification = await then.a_user_notification_is_received(orderId)
        expect(userNotification.Status).toEqual('ACCEPTED')
        expect(userNotification.Message).toEqual("Good news! The restaurant has accepted your order")
      })

      describe('When we confirm delivery of the order', () => {
        beforeAll(async () => {
          await when.we_confirm_delivery(orderId)
        })

        it('Should update order status to "DELIVERED"', async () => {
          const order = await then.an_order_exists_in_dynamodb(orderId)
          expect(order.status).toEqual('DELIVERED')
        })

        it('Should complete the execution', async () => {
          await then.execution_status_is(executionArn, 'SUCCEEDED')
        })
      })
    })
  })
})