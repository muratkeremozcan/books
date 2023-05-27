require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()
const messages = require('../../lib/messages')

describe('Test case: restaurant rejects the order', () => {
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

    describe('When we reject the order', () => {
      beforeAll(async () => {
        await when.we_reject_order(orderId, restaurantNotification.TaskToken)
      })

      it('Should fail the execution', async () => {
        await then.execution_status_is(executionArn, 'FAILED')
      })

      it('Should update order status to "REJECTED"', async () => {
        const order = await then.an_order_exists_in_dynamodb(orderId)
        expect(order.status).toEqual('REJECTED')
      })

      it('Should send a SNS notification to the user topic', async () => {
        const userNotification = await then.a_user_notification_is_received(orderId)
        expect(userNotification.Status).toEqual('CANCELLED')
        expect(userNotification.Message).toEqual("We're sorry, but your order has been cancelled")
      })
    })
  })
})