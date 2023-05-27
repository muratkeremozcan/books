const AWS = require('aws-sdk')
const StepFunctions = new AWS.StepFunctions()
const StepFunctionsLocal = new AWS.StepFunctions({
  endpoint: 'http://localhost:8083'
})

const a_local_statemachine_instance = async (stateMachineArn, name) => {
  const describeResp = await StepFunctions.describeStateMachine({
    stateMachineArn
  }).promise()

  const createResp = await StepFunctionsLocal.createStateMachine({
    name,
    definition: describeResp.definition,
    roleArn: describeResp.roleArn
  }).promise()

  return createResp.stateMachineArn
}

module.exports = {
  a_local_statemachine_instance
}
