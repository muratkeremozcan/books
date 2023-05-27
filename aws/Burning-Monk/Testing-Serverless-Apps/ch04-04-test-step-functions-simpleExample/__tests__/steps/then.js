const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()
const StepFunctionsLocal = new AWS.StepFunctions({
  endpoint: 'http://localhost:8083'
})
const { ExecutionFailedError } = require('../lib/errors')

const execution_output_is = async (executionArn, expectation) => {
  const resp = await StepFunctions.describeExecution({
    executionArn
  }).promise()

  if (resp.status === 'FAILED') {
    throw new ExecutionFailedError(executionArn)
  }

  expect(resp.output).toEqual(expectation)

  return resp.output
}

const local_execution_output_is = async (executionArn, expectation) => {
  const resp = await StepFunctionsLocal.describeExecution({
    executionArn
  }).promise()

  if (resp.status === 'FAILED') {
    throw new ExecutionFailedError(executionArn)
  }

  expect(resp.output).toEqual(expectation)

  return resp.output
}

const local_execution_status_is = async (executionArn, expectation) => {
  const resp = await StepFunctionsLocal.describeExecution({
    executionArn
  }).promise()

  expect(resp.status).toEqual(expectation)
}

module.exports = {
  execution_output_is,
  local_execution_output_is,
  local_execution_status_is,
}