// Provide a type for this in callbacks when it’s part of your API.

{
  class C {
    vals = [1, 2, 3]
    logSquares() {
      for (const val of this.vals) {
        console.log(val * val)
      }
    }
  }
  const c = new C()
  c.logSquares()
  // c.logSquares() actually does two things:
  /// it calls C.prototype.logSquares
  /// it binds the value of this to c

  // By pulling out a reference to logSquares, you’ve separated these, and this gets set to undefined.
  const method = c.logSquares
  // method() // Cannot read properties of undefined (reading 'vals')

  // we can control the this value by using call, apply, or bind
  method.call(c)
  method.apply(c)
  method.bind(c)()
}

// suppose we have a class, and we want to make its usage easier
// The onClick() { ... } definition defines a property on ResetButton.prototype. This is shared by all instances of ResetButton.
// When you bind this.onClick = ... in the constructor, it creates a property called onClick on the instance of ResetButton with this bound to that instance.
{
  declare function makeButton(props: {text: string; onClick: () => void}): void
  class ResetButton {
    constructor() {
      this.onClick = this.onClick.bind(this)
    }
    render() {
      return makeButton({text: 'Reset', onClick: this.onClick})
    }
    onClick() {
      alert(`Reset ${this}`)
    }
  }
}

// we can shorthand the above by using an arrow function
{
  declare function makeButton(props: {text: string; onClick: () => void}): void
  class ResetButton {
    render() {
      return makeButton({text: 'Reset', onClick: this.onClick})
    }
    onClick = () => {
      alert(`Reset ${this}`) // "this" always refers to the ResetButton instance.
    }
  }
}

// Because this binding is part of JavaScript, TypeScript models it.
// This means that if you’re writing (or typing) a library that sets the value of this on callbacks, then you should model this, too.
// You do this by adding a this parameter to your callback:
{
  declare function makeButton(props: {text: string; onClick: () => void}): void
  function addKeyListener(el: HTMLElement, fn: (this: HTMLElement, e: KeyboardEvent) => void) {
    el.addEventListener('keydown', e => {
      // fn(el, e) // ~ Expected 1 arguments, but got 2

      // TS will enforce that you call, apply or bind
      fn.call(el, e)
      fn.apply(el, [e])
      fn.bind(el)(e)
    })
  }

  // a user of the function can reference this and get the correct type
  declare let el: HTMLElement
  addKeyListener(el, function (e) {
    this.innerHTML // OK, "this" has type of HTMLElement
  })

  // mind that you cannot reference this in an arrow function, because the arrow function overrides the this binding
  addKeyListener(el, e => {
    this.innerHTML
    // ~~~~~~~~~ Property 'innerHTML' does not exist on type 'Foo'
  })
}
