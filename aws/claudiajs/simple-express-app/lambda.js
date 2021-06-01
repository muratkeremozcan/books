'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
// starts the express app inside the lambda function
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

// The Express.js app is a small local HTTP server inside your AWS Lambda function, 
// and the serverless-express module acts as a proxy between an API Gateway event and that local HTTP server.
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
