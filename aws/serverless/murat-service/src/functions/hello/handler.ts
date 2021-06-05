import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

// The handler.ts file contains your function code. 
// The function definition in serverless.ts will point to this handler.ts file and the function exported here.

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('hello works');
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`
  });
}

export const main = middyfy(hello);
// https://middy.js.org/
/*
Write your Lambda handlers as usual, focusing mostly on implementing the bare business logic for them.
Import middyfy and all the middlewares you want to use.
Wrap your handler in the middy() factory function. This will return a new enhanced instance of your original handler, to which you will be able to attach the middlewares you need.
Attach all the middlewares you need using the function .use(somemiddleware())
*/