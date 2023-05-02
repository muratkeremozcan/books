const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()
const StepFunctionsLocal = new AWS.StepFunctions({
  endpoint: 'http://localhost:8083'
})

const we_start_execution = async (stateMachineArn, input) => {
  const { executionArn } = await StepFunctions.startExecution({
    stateMachineArn,
    input: JSON.stringify(input)
  }).promise()

  return executionArn
}

const we_start_local_execution = async (stateMachineArn, input) => {
  const { executionArn } = await StepFunctionsLocal.startExecution({
    stateMachineArn,
    input: JSON.stringify(input)
  }).promise()

  return executionArn
}

module.exports = {
  we_start_execution,
  we_start_local_execution
}