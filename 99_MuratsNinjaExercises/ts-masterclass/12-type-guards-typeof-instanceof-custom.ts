// typeof operator
// only works with JavaScript primitive types (string, number, undefined, null, Boolean, and symbol).
// you cannot use it to check the type of an interface because this information is erased at runtime.
class Properties {
  width: number = 0

  setWidth(width: number | string) {
    if (typeof width === 'number') {
      this.width = width
    } else {
      this.width = parseInt(width)
    }
  }
}

const p = new Properties()

p.setWidth(100)
p.width //?

p.setWidth('200')
p.width //?

// instanceof : useful with classes
{
  class Person {
    constructor(public name: string) {}
  }

  function greet(obj: any) {
    if (obj instanceof Person) {
      console.log(obj.name)
    }
  }

  greet(new Person('Pat')) // Pat
  greet('Pat') // nothing
}

// custom type guard
// customizable type assertions where you can perform a runtime check to ensure the validity of the assertion

interface Article {
  title: string
  content: string
}

function isArticle(object: any): object is Article {
  return 'title' in object && 'content' in object
}

fetch('http://example.com')
  .then(response => response.json())
  .then(body => {
    if (isArticle(body)) {
      return body.title
    } else {
      throw new Error('This is not an article')
    }
  })

// bonus: Nominal types
// in TS, you can have 2 interfaces that have the same structure but are not the same type
// this is called structural typing
// in other languages that's not ok, all interfaces must be unique in their structure
// if we want to replicate this behavior in TS, we can use a trick called Branded types

type UserId = string & {__brand: 'UserId'}
type ArticleId = string & {__brand: 'ArticleId'}

declare const userId: UserId

function getArticle(articleId: ArticleId) {}

// getArticle(userId); // 🔴 Error!

// We can generalize nominal types with a generic type
type Nominal<T, K extends string> = T & {__brand: K}

type UserId2 = Nominal<string, 'UserId'>
type ArticleId2 = Nominal<string, 'ArticleId'>
