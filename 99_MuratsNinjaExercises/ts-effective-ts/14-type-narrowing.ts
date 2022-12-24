// Understand how TypeScript narrows types based on conditionals and other types of control flow.
// Use tagged/discriminated unions and user-defined type guards to help the process of narrowing.

// type narrowing with conditional checking
{
  const el = document.getElementById('foo') // Type is HTMLElement | null
  if (el) {
    el // Type is HTMLElement
    el.innerHTML = 'Party Time'.blink()
  } else {
    el // Type is null
    alert('No element #foo')
  }
}

// You can also narrow a variable’s type for the rest of a block by throwing or returning from a branch.
{
  const el = document.getElementById('foo') // Type is HTMLElement | null
  if (!el) throw new Error('Unable to find #foo')
  el // Now type is HTMLElement
  el.innerHTML = 'Party Time'.blink()
}

// can narrow with instanceof
{
  function contains(text: string, search: string | RegExp) {
    if (search instanceof RegExp) {
      search // Type is RegExp
      return !!search.exec(text)
    }
    search // Type is string
    return text.includes(search)
  }
}

// can narrow with property checking
{
  type A = {
    a: number
  }
  type B = {
    b: number
  }
  function pickAB(ab: A | B) {
    if ('a' in ab) {
      ab // Type is A
    } else {
      ab // Type is B
    }
    ab // Type is A | B
  }
}

// isArray can narrow types
{
  function contains(text: string, terms: string | string[]) {
    const termList = Array.isArray(terms) ? terms : [terms]
    termList // Type is string[]
  }
}

// using explicit tags can narrow types (aka tagged union)
{
  type UploadEvent = {
    type: 'upload'
    filename: string
    contents: string
  }
  type DownloadEvent = {
    type: 'download'
    filename: string
  }
  type AppEvent = UploadEvent | DownloadEvent

  function handleEvent(e: AppEvent) {
    switch (e.type) {
      case 'download':
        e // Type is DownloadEvent
        break
      case 'upload':
        e // Type is UploadEvent
        break
    }
  }
}

// can narrow using prop in object (aka type guard)
{
  // "el is HTMLInputElement" as a return type tells the type checker that it can narrow the type of the parameter if the function returns true.
  const isInputElement = (el: HTMLElement): el is HTMLInputElement => 'value' in el

  function getElementContent(el: HTMLElement) {
    if (isInputElement(el)) {
      el // Type is HTMLInputElement
      return el.value
    }
    el // Type is HTMLElement
    return el.textContent
  }
}

// help TS with array methods by using type guards
{
  const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael']
  const members = ['Janet', 'Michael']
    .map(who => jackson5.find(n => n === who))
    .filter(who => who !== undefined) // Type is (string | undefined)[]
}
{
  const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael']

  // the 'x is T' helps TS narrow the type of the parameter if the function returns true
  const isDefined = <T>(x: T | undefined): x is T => x != null

  const members = ['Janet', 'Michael'].map(who => jackson5.find(n => n === who)).filter(isDefined) // Type is string[]
}
