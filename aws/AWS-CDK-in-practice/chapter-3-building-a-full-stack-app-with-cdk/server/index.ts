import express, {Express} from 'express'
import type {Request, Response} from 'express'
import {config} from 'dotenv'
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'

config()

const app: Express = express()
const port: string | number = process.env.PORT || 80

interface Todo {
  partition_key?: string
  sort_key?: string
  name: string
  description: string
  completed: boolean
}

/* ----------
 * DynamoDB Client (AWS SDK) for Node.js
 * ---------- */
const ddbClient: DynamoDBClient = new DynamoDBClient({region: 'us-east-1'})

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
}

const dynamodb = DynamoDBDocumentClient.from(ddbClient, {marshallOptions})
/* ----------
 * DynamoDB Client (AWS SDK) for Node.js
 * ---------- */

app.use(cors())
app.use(express.json())

app.post('/', async (req: Request, res: Response) => {
  const {name, description, completed}: Todo = req.body.todo

  const todo: Todo = {
    sort_key: uuidv4(),
    partition_key: 'todo',
    name,
    description,
    completed,
  }

  const params: PutCommandInput = {
    TableName: 'main_table',
    Item: todo,
  }

  const command: PutCommand = new PutCommand(params)

  await dynamodb.send(command)

  res.status(200).send({
    todo,
  })
})

app.get('/', async (_, res: Response) => {
  const params: QueryCommandInput = {
    TableName: 'main_table',
    ExpressionAttributeNames: {
      '#pk': 'partition_key',
    },
    ExpressionAttributeValues: {
      ':pk': 'todo',
    },
    KeyConditionExpression: '#pk = :pk',
  }

  const command: QueryCommand = new QueryCommand(params)

  const {Items} = await dynamodb.send(command)

  res.status(200).send({
    todos: Items,
  })
})

app.delete('/todo/:id', async (req: Request, res: Response) => {
  const sort_key = req.params.id

  const params: DeleteCommandInput = {
    TableName: 'main_table',
    Key: {
      partition_key: 'todo',
      sort_key,
    },
  }

  const command: DeleteCommand = new DeleteCommand(params)

  await dynamodb.send(command)
  res.status(200).send({
    message: 'Todo deleted successfully!',
  })
})

app.put('/todo/:id', async (req: Request, res: Response) => {
  const sort_key = req.params.id
  const {name, description, completed}: Todo = req.body.todo

  const params: UpdateCommandInput = {
    TableName: 'main_table',
    Key: {
      partition_key: 'todo',
      sort_key,
    },
    UpdateExpression: 'set #n = :n, description = :d, completed = :c',
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ExpressionAttributeValues: {
      ':n': name,
      ':d': description,
      ':c': completed,
    },
  }

  const command: UpdateCommand = new UpdateCommand(params)

  await dynamodb.send(command)
  res.status(200).send({
    message: 'Todo updated successfully!',
  })
})

app.get('/healthcheck', async (_, res: Response) =>
  res.status(200).send(JSON.stringify('OK')),
)

app.listen(port, () => {
  console.info(`API listening on port ${port}`)
})
