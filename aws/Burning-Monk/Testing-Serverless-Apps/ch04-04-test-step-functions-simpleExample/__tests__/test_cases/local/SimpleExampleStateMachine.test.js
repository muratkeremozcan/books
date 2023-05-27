require('../../steps/init')
const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const { ExecutionFailedError } = require('../../lib/errors')
const retry = require('async-retry')

describe('Given a local instance of SimpleExample', () => {
  let stateMachineArn

  beforeAll(async () => {
    stateMachineArn = await given.a_local_statemachine_instance(
      process.env.StateMachineArn,
      "SimpleExample"
    )
  })

  it('Should return true when the HTML is bigger than 10kb', async () => {
    const executionArn = await when.we_start_local_execution(
      stateMachineArn + '#IsBigPath', 
      { url: 'https://theburningmonk.com' }
    )

    await retry(async (bail) => {
      await then.local_execution_output_is(executionArn, 'true')
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
    const executionArn = await when.we_start_local_execution(
      stateMachineArn + '#IsNotBigPath', 
      { url: 'https://theburningmonk.com' }
    )

    await retry(async (bail) => {
      await then.local_execution_output_is(executionArn, 'false')
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

  it('Should fail if cannot fetch HTML', async () => {
    const executionArn = await when.we_start_local_execution(
      stateMachineArn + '#GetHtmlError', 
      { url: 'https://google.com' }
    )

    await retry(async () => {
      await then.local_execution_status_is(executionArn, 'FAILED')
    }, {
      retries: 3,
      maxTimeout: 1000
    })
  })
})