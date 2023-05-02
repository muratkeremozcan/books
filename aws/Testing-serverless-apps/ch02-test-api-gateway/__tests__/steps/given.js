const AWS = require('aws-sdk')
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const Cognito = new AWS.CognitoIdentityServiceProvider()
const chance  = require('chance').Chance()

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

const restaurant_exists_in_dynamodb = async (restaurant) => {
  await DocumentClient.put({
    TableName: process.env.RESTAURANTS_TABLE_NAME,
    Item: restaurant
  }).promise()

  return restaurant
}

module.exports = {
  an_authenticated_user,
  restaurant_exists_in_dynamodb
}