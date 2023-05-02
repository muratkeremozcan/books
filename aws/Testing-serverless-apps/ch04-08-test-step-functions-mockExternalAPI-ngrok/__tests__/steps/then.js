const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()
const { ExecutionFailedError } = require('../lib/errors')

const execution_output_is = async (executionArn, expectation) => {
  const resp = await StepFunctions.describeExecution({
    executionArn
  }).promise()

  if (resp.status === 'FAILED') {
    throw new ExecutionFailedError(executionArn)
  }

  const output = JSON.parse(resp.output)
  expect(output).toEqual(expectation)  

  return output
}

const execution_status_is = async (executionArn, expectation) => {
  const resp = await StepFunctions.describeExecution({
    executionArn
  }).promise()

  expect(resp.status).toEqual(expectation)
}

module.exports = {
  execution_output_is,
  execution_status_is,
}