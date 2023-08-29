import React, {useEffect, useState} from 'react'
import axios from 'axios'
import type {Interfaces} from '../../../@types/interfaces'
import {CreateTodo} from '../CreateTodo'
import {Todo} from '../Todo'
import {MainContainer} from './styles'

const backend_url = process.env.REACT_APP_BACKEND_URL as string

export const Main: React.FC = () => {
  const [todos, setTodos] = useState<Interfaces.Todo[]>([])

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(backend_url)
      setTodos(response.data.todos)
    }
    fetchTodos()
  }, [])

  const handleTodoSubmit = async ({new_todo}: {new_todo: Interfaces.Todo}) => {
    const response = await axios.post(backend_url, {todo: new_todo})
    setTodos(current_todos => [...current_todos, response.data.todo])
  }

  const handleTodoDelete = async (id: string) => {
    try {
      await axios.delete(`${backend_url}/${id}`)
      setTodos(current_todos => current_todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting the todo:', error)
    }
  }

  const handleTodoEdit = async (updatedTodo: Interfaces.Todo) => {
    try {
      const response = await axios.put(
        `${backend_url}/${updatedTodo.id}`,
        updatedTodo,
      )

      // Assuming the backend returns the updated todo
      const editedTodo: Interfaces.Todo = response.data.todo
      // Update the local state with the edited todo
      setTodos(current_todos =>
        current_todos.map(todo =>
          todo.id === editedTodo.id ? editedTodo : todo,
        ),
      )
    } catch (error) {
      console.error('Error editing the todo:', error)
    }
  }

  const to_complete = todos.filter(todo => !todo.todo_completed).length
  const completed = todos.filter(todo => todo.todo_completed).length

  return (
    <MainContainer>
      <h1>Today</h1>
      <CreateTodo handleTodoSubmit={handleTodoSubmit} />
      <p>
        {completed}/{to_complete} completed
      </p>
      {todos.map(t => (
        <Todo
          key={t.id}
          todo={t}
          handleDelete={handleTodoDelete}
          handleEdit={handleTodoEdit}
        />
      ))}
    </MainContainer>
  )
}
