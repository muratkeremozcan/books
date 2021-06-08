'use strict';

const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.generateToken = jsonToSign => {
  const hasValidId = jsonToSign !== null && jsonToSign.applicationId;

  if (hasValidId) {
    return getApplication(jsonToSign.applicationId)
      .then(application => {
        const hasValidSecret = jsonToSign.applicationSecret && jsonToSign.applicationSecret === application.applicationSecret;

        if (hasValidSecret) {
          return jwt.sign(jsonToSign, SECRET_KEY);
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        throw new Error('Invalid applicationId or secret');
      });
  } else {
    throw new Error('Invalid request');
  }
};

module.exports.generatePolicy = (token, methodArn) => {
  try {
    return decodeToken(token)
      .then(decoded => {
        return buildPolicy('user', 'Allow', methodArn);
      })
      .catch(error => {
        throw new Error('Unauthorized');
      });
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

function decodeToken(token) {
  try {
    var decoded = jwt.verify(token, SECRET_KEY);

    return getApplication(decoded.applicationId).then(application => {
      var hasValidSecret = decoded.applicationSecret && decoded.applicationSecret === application.applicationSecret;

      if (hasValidSecret) {
        // sign with default (HMAC SHA256)
        return decoded;
      } else {
        throw new Error();
      }
    });
  } catch (error) {
    return null;
  }
}

module.exports.createApplication = applicationJson => {
  const params = {
    TableName: process.env.APPLICATION_DYNAMODB_TABLE,
    Item: applicationJson
  };

  return dynamo.put(params).promise();
};

function buildPolicy(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    var policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [
        {
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

function getApplication(applicationId) {
  const params = {
    Key: {
      applicationId: applicationId
    },
    TableName: process.env.APPLICATION_DYNAMODB_TABLE
  };

  return dynamo
    .get(params)
    .promise()
    .then(response => {
      return response.Item;
    })
    .catch(error => {
      throw new Error('There was a problem fetching the item from Dynamo');
    });
}
