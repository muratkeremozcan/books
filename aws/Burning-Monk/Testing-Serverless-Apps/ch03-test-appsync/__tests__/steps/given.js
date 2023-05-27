const AWS = require('aws-sdk')
const Cognito = new AWS.CognitoIdentityServiceProvider()
const AppSync = new AWS.AppSync()
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const chance = require('chance').Chance()
const velocityUtil = require('amplify-appsync-simulator/lib/velocity/util')
const velocityMapper = require('amplify-appsync-simulator/lib/velocity/value-mapper/mapper')
const velocityTemplate = require('amplify-velocity-template')

const a_random_user = () => {
  const firstName = chance.first({ nationality: 'en' })
  const lastName = chance.first({ nationality: 'en' })
  const suffix = chance.string({ length: 4, pool: 'abcdefghijklmnopqrstuvwxyz' })
  const name = `${firstName} ${lastName} ${suffix}`
  const password = chance.string({ length: 8 })
  const email = `${firstName}-${lastName}-${suffix}@appsyncmasterclass.com`

  return {
    name,
    password,
    email
  }
}

const an_authenticated_user = async () => {
  const { name, email, password } = a_random_user()

  const userPoolId = process.env.CognitoUserPoolId
  const clientId = process.env.CognitoWebClientId

  const signUpResp = await Cognito.signUp({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'name', Value: name }
    ]
  }).promise()

  const username = signUpResp.UserSub
  console.log(`[${email}] - user has signed up [${username}]`)

  await Cognito.adminConfirmSignUp({
    UserPoolId: userPoolId,
    Username: username
  }).promise()

  console.log(`[${email}] - confirmed sign up`)

  const auth = await Cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }).promise()

  console.log(`[${email}] - signed in`)

  return {
    username,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken
  }
}

const an_evaluated_appsync_template = async (template, context) => {
  const response = await AppSync.evaluateMappingTemplate({ 
    template, 
    context: JSON.stringify(context)
  }).promise()

  if (response.error) {
    throw new Error(response.error.message)
  }

  return JSON.parse(response.evaluationResult)
}

const a_simulated_appsync_template = (template, context) => {
  context.args = context.arguments
  const util = velocityUtil.create([], new Date(), Object())
  const ast = velocityTemplate.parse(template)
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false
  })
  return JSON.parse(compiler.render({
    context,
    ctx: context,
    util,
    utils: util,
  }))
}

const a_user_follows_another = async (userId, otherUserId) => {
  await DocumentClient.put({
    TableName: process.env.RELATIONSHIPS_TABLE,
    Item: {
      userId,
      sk: `FOLLOWS_${otherUserId}`,
      otherUserId,
      createdAt: new Date().toJSON()
    }
  }).promise()
}

module.exports = {
  a_random_user,
  an_authenticated_user,
  an_evaluated_appsync_template,
  a_simulated_appsync_template,
  a_user_follows_another,
}