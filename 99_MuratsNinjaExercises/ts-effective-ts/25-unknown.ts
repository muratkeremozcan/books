// The unknown type is a type-safe alternative to any. Use it when you know you have a value but do not know what its type is.
// Use unknown to force your users to use a type assertion or do type checking.
// Understand the difference between unknown > {} > object  (getting narrower)
// The {} type consists of all values except null and undefined.
// The object type consists of all non-primitive types. This doesn’t include true or 12 or "foo" but does include objects and arrays.

{
  function parseYAML(yaml: string): any {
    // ...
  }

  const book0 = parseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Brontë
	`)
  // Without the type declarations, the book0 variable would quietly get an any type, thwarting type checking wherever it’s used:
  alert(book0.title)
  book0('read')

  // A safer alternative would be to have parseYAML return an unknown type:
  function safeParseYAML(yaml: string): unknown {
    return parseYAML(yaml)
  }

  const book1 = safeParseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Brontë
`)
  alert(book1.title)
  // ~~~~ Object is of type 'unknown'
  book1('read')
  // ~~~~~~~~~~ Object is of type 'unknown'

  // Use type assertions with unknown
  // with type assertion, we can get some type checking out of unknown
  interface Book {
    name: string
    author: string
  }
  const book2 = safeParseYAML(`
	name: The Tenant of Wildfell Hall
	author: Anne Brontë
	`) as Book

  alert(book2.title)
  book2('read')

  // use instanceof type check with unknown
  // A type assertion isn’t the only way to recover a type from an unknown object. An instanceof check will do:
  function processValue(val: unknown) {
    if (val instanceof Date) {
      val // Type is Date
    }
  }

  // if instanceof check is fine, a type guard is fine too
  function isBook(val: unknown): val is Book {
    // TypeScript requires quite a bit of proof to narrow an unknown type:
    // you first have to demonstrate that val is an object type and that it is non-null (since typeof null === 'object').
    return typeof val === 'object' && val !== null && 'name' in val && 'author' in val
  }
  function processValue2(val: unknown) {
    if (isBook(val)) {
      val // Type is Book
    }
  }
}
