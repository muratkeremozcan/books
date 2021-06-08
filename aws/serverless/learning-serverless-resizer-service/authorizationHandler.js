'use strict';

const authorizer = require('./authorizer');

module.exports.generateToken = (event, context, callback) => {
  try {
    authorizer
      .generateToken(JSON.parse(event.body || {}))
      .then(token => {
        sendResponse(200, { token }, callback);
      })
      .catch(error => {
        sendResponse(401, { error: error.message }, callback);
      });
  } catch (error) {
    sendResponse(401, { error: error.message }, callback);
  }
};

module.exports.authorize = (event, context, callback) => {
  try {
    authorizer
      .generatePolicy(event.authorizationToken, event.methodArn)
      .then(policy => {
        callback(null, policy);
      })
      .catch(error => {
        callback(error.message);
      });
  } catch (error) {
    callback(error.message);
  }
};

module.exports.createApplication = (event, context, callback) => {
  authorizer
    .createApplication(JSON.parse(event.body))
    .then(() => {
      sendResponse(200, { message: 'Application created' }, callback);
    })
    .catch(error => {
      sendResponse(500, { message: 'There was a problem creating the application' }, callback);
    });
};

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}
