import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Component, useState, useEffect, useReducer} from 'react'

type HNResponse = {
  hits: {
    title: string
    objectID: string
    url: string
  }[]
}

// type State = {
//   data?: HNResponse
//   isLoading: boolean
//   error?: string
// }
type State =
  | {status: 'empty'}
  | {status: 'loading'}
  | {status: 'error'; error: string}
  | {status: 'success'; data: HNResponse}

type Action =
  | {kind: 'request'}
  | {kind: 'success'; results: HNResponse}
  | {kind: 'failure'; error: string}

function display(action: Action) {
  if (action.kind === 'success') {
    console.log(action.results)
  }
}

function reducer(state: State, action: Action): State {
  switch (action.kind) {
    case 'request':
      return {status: 'loading'}
    case 'success':
      return {status: 'success', data: action.results}
    case 'failure':
      return {status: 'error', error: action.error}
  }
}

function App() {
  const [query, setQuery] = useState<string>()
  const [state, dispatch] = useReducer(reducer, {status: 'empty'})

  useEffect(() => {
    let ignore = false

    dispatch({kind: 'request'})
    fetch(`https://hn.algolia.com/api/v1/search?query=${query}`).then(
      (response: Response) =>
        response.json().then((results: HNResponse) => {
          if (!ignore) dispatch({kind: 'success', results})
        }),
      (error: Error) => dispatch({kind: 'failure', error: error.message}),
    )

    return () => {
      ignore = true
    }
  }, [query])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {state.status === 'loading' && <span>Loading...</span>}
      {state.status === 'success' && (
        <ul>
          {state.data &&
            state.data.hits &&
            state.data.hits.map(item => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
        </ul>
      )}
      {state.status === 'error' && <span>Error: {state.error}</span>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
