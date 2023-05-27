require('../../steps/init')
const when = require('../../steps/when')
const then = require('../../steps/then')
const { ExecutionFailedError } = require('../../lib/errors')
const retry = require('async-retry')

describe('When we start an execution', () => {
  it('Should return true when the HTML is bigger than 10kb', async () => {
    const executionArn = await when.we_start_execution(
      process.env.StateMachineArn, 
      { url: 'https://theburningmonk.com' }
    )

    await retry(async (bail) => {
      await then.execution_output_is(executionArn, 'true')
        .catch(err => {
          if (err instanceof ExecutionFailedError) {
            bail(err)
          } else {
            throw err
          }
        })
    }, {
      retries: 3,
      maxTimeout: 1000
    })
  })

  it('Should return false when the HTML is smaller than 10kb', async () => {
    const executionArn = await when.we_start_execution(
      process.env.StateMachineArn, 
      { url: 'https://google.com' }
    )

    await retry(async (bail) => {
      await then.execution_output_is(executionArn, 'false')
        .catch(err => {
          if (err instanceof ExecutionFailedError) {
            bail(err)
          } else {
            throw err
          }
        })
    }, {
      retries: 3,
      maxTimeout: 1000
    })
  })
})