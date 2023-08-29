import {DynamoDB} from 'aws-sdk'
import {v4 as uuidv4} from 'uuid'
import type {PostEvent, Todo} from 'customTypes/index'
import {httpResponse} from '../../handlers/httpResponse'

export const handler = async (event: PostEvent) => {
  try {
    const {todo_name, todo_description, todo_completed} = JSON.parse(
      event.body,
    ).todo
    const tableName = process.env.TABLE_NAME as string
    const awsRegion = process.env.REGION || 'us-east-1'

    // By default, LocalStack's DynamoDB service runs on port 4588.
    // To ensure that your local server communicates with this local instance instead of the actual AWS DynamoDB service,
    //  you need to set a custom endpoint.
    // In the lambda functions for both POST and GET methods,
    //  the endpoint for the DynamoDB client (`DocumentClient()`) is conditionally
    // set based on the presence of an environment variable `DYNAMODB_ENDPOINT`.
    // If this environment variable exists, it will use that (which in the local context points to LocalStack).
    // Otherwise, it defaults to the real AWS DynamoDB endpoint.
    const dynamoDB = new DynamoDB.DocumentClient({
      region: awsRegion,
      endpoint:
        process.env.DYNAMODB_ENDPOINT ||
        `https://dynamodb.${awsRegion}.amazonaws.com`,
    })

    const todo: Todo = {
      id: uuidv4(),
      todo_completed,
      todo_description,
      todo_name,
    }

    await dynamoDB.put({TableName: tableName, Item: todo}).promise()

    return httpResponse(200, JSON.stringify({todo}))
  } catch (error: any) {
    console.error(error)

    return httpResponse(400, JSON.stringify({message: error.message}))
  }
}
