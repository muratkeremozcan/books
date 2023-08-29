export interface Todo {
  id: string
  todo_name: string
  todo_description: string
  todo_completed: boolean
}

export interface PostEvent {
  body: string
}

export interface PutEvent {
  body: string
}

export interface DeleteEvent {
  pathParameters: {
    id: number
  }
}
