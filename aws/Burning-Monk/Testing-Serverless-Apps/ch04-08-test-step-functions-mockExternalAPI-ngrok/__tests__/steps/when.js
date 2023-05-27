const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()

const we_start_execution = async (stateMachineArn, input) => {
  const { executionArn } = await StepFunctions.startExecution({
    stateMachineArn,
    input: JSON.stringify(input)
  }).promise()

  return executionArn
}

module.exports = {
  we_start_execution
}