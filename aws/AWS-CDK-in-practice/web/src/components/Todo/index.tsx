import React, {useState} from 'react'

import type {Interfaces} from '../../../@types/interfaces'

import {TodoActions, TodoBox, TodoContainer, TodoContent} from './styles'

interface Props {
  todo: Interfaces.Todo
  handleEdit: (todo: Interfaces.Todo) => void
  handleDelete: (id: string) => void
}

export const Todo: React.FC<Props> = ({todo, handleEdit, handleDelete}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTodo, setEditedTodo] = useState(todo)

  const handleInputChange = (type: string, value: string) => {
    setEditedTodo(current_todo => ({...current_todo, [type]: value}))
  }

  return (
    <TodoContainer>
      <input type="checkbox" name="" id="" />
      <TodoBox>
        {isEditing ? (
          <>
            <input
              value={editedTodo.todo_name}
              onChange={({target}) =>
                handleInputChange('todo_name', target.value)
              }
            />
            <input
              value={editedTodo.todo_description}
              onChange={({target}) =>
                handleInputChange('todo_description', target.value)
              }
            />
            <button
              onClick={() => {
                handleEdit(editedTodo)
                setIsEditing(false)
              }}
            >
              Save
            </button>
          </>
        ) : (
          <TodoContent>
            <h1>{todo.todo_name}</h1>
            <p>{todo.todo_description}</p>
          </TodoContent>
        )}
        <TodoActions>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (todo.id) {
                handleDelete(todo.id)
              }
            }}
          >
            Delete
          </button>
        </TodoActions>
      </TodoBox>
    </TodoContainer>
  )
}
