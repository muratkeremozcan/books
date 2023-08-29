import {DynamoDB} from 'aws-sdk'
import {PutEvent, Todo} from 'customTypes/index'
import {httpResponse} from '../../handlers/httpResponse'

export const handler = async (event: PutEvent) => {
  try {
    const {id, todo_name, todo_description, todo_completed} = JSON.parse(
      event.body,
    )

    if (!id) {
      return httpResponse(
        400,
        JSON.stringify({message: 'Todo id is required for update.'}),
      )
    }

    const tableName = process.env.TABLE_NAME as string
    const awsRegion = process.env.REGION || 'us-east-1'

    const dynamoDB = new DynamoDB.DocumentClient({
      region: awsRegion,
      endpoint:
        process.env.DYNAMODB_ENDPOINT ||
        `https://dynamodb.${awsRegion}.amazonaws.com`,
    })

    const updateExpression =
      'set todo_name = :n, todo_description = :d, todo_completed = :c'
    const expressionAttributeValues = {
      ':n': todo_name,
      ':d': todo_description,
      ':c': todo_completed,
    }

    await dynamoDB
      .update({
        TableName: tableName,
        Key: {id},
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    const updatedTodo: Todo = {
      id,
      todo_name,
      todo_description,
      todo_completed,
    }

    return httpResponse(200, JSON.stringify({todo: updatedTodo}))
  } catch (error: any) {
    console.error(error)
    return httpResponse(400, JSON.stringify({message: error.message}))
  }
}
