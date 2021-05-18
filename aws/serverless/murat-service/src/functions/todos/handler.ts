import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as todoItems from './todos.json';

const todos = async () => {
  console.log('todos works');
  return formatJSONResponse(todoItems);
}

export const main = middyfy(todos);