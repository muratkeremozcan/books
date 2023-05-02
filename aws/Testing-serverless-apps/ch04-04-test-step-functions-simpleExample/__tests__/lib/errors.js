class ExecutionFailedError extends Error {
  constructor(executionArn) {
    super(`${executionArn}: execution failed`)
    this.name = "ExecutionFailedError"
  }
}

module.exports = {
  ExecutionFailedError
}