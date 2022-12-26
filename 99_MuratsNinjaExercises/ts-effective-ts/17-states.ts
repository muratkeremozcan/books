// types that represent both valid and invalid states are likely to lead to confusing and error-prone code.
//  Prefer types that only represent valid states. Even if they are longer or harder to express, they will save you time and pain in the end!

// example: representing state on a page with a tagged union (discriminated union)
{
  type RequestPending = {
    state: 'pending'
  }
  type RequestError = {
    state: 'error'
    error: string
  }
  type RequestSuccess = {
    state: 'ok'
    pageText: string
  }
  type RequestState = RequestPending | RequestError | RequestSuccess

  type State = {
    currentPage: string
    requests: {[page: string]: RequestState}
  }

  // because of the clear types representing State, the implementation of the functions below are much easier

  function getUrlForPage(p: string) {
    return ''
  }
  function renderPage(state: State) {
    const {currentPage} = state
    const requestState = state.requests[currentPage]
    switch (requestState.state) {
      case 'pending':
        return `Loading ${currentPage}...`
      case 'error':
        return `Error! Unable to load ${currentPage}: ${requestState.error}`
      case 'ok':
        return `<h1>${currentPage}</h1>\n${requestState.pageText}`
    }
  }

  async function changePage(state: State, newPage: string) {
    state.requests[newPage] = {state: 'pending'}
    state.currentPage = newPage
    try {
      const response = await fetch(getUrlForPage(newPage))
      if (!response.ok) {
        throw new Error(`Unable to load ${newPage}: ${response.statusText}`)
      }
      const pageText = await response.text()
      state.requests[newPage] = {state: 'ok', pageText}
    } catch (e) {
      state.requests[newPage] = {state: 'error', error: '' + e}
    }
  }
}
