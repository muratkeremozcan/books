'use strict'

function lambdaFunction(event, context, callback) {
  callback(null, 'Hello from AWS Lambda')
}

exports.handler = lambdaFunction
