import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import todos from '@functions/todos';

// A service is made up of 
// * AWS Lambda Functions (handler.ts)
// * the events that trigger them  (index.ts)
// * any AWS infrastructure resources they require
// https://www.serverless.com/framework/docs/providers/aws/guide/services/

const serverlessConfiguration: AWS = {
  // Declare a Serverless service
  service: 'murat-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  // Define any custom plugins to be used
  plugins: ['serverless-webpack'],
  // Define the provider the service will be deployed to, and the runtime
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // Define one or more functions in the service
  functions: { hello, todos },
};

module.exports = serverlessConfiguration;
