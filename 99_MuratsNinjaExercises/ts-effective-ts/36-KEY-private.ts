// The private access modifier is only enforced through the type system.
// It has no effect at runtime and can be bypassed with an assertion. Don’t assume it will keep data hidden.
// use the new # prefix instead

// private can be cheated in TS
{
  class Diary {
    private secret = 'cheated on my English test'
  }

  const diary = new Diary()
  diary.secret //?
  // ~~~~~~ Property 'secret' is private and only
  //        accessible within class 'Diary'

  // OK
  ;(diary as any).secret //?
}

//  a newer alternative is to use # to mark private fields, can't be cheated
{
  class Diary {
    #secret = 'cheated on my English test'
  }

  const diary = new Diary()
  diary.secret //?
  // ~~~~~~ Property 'secret' is private and only
  //        accessible within class 'Diary'

  // won't work!
  ;(diary as any).secret //?
}

// another example of # to mark private fields
{
  declare function hash(text: string): number
  class PasswordChecker {
    #passwordHash: number

    constructor(passwordHash: number) {
      this.#passwordHash = passwordHash
    }

    checkPassword(password: string) {
      return hash(password) === this.#passwordHash
    }
  }

  const checker = new PasswordChecker(hash('s3cret'))
  checker.checkPassword('secret') // Returns false
}

// note: we can use closures to hide private data as well, but that's too verbose
{
  declare function hash(text: string): number

  class PasswordChecker {
    checkPassword: (password: string) => boolean
    constructor(passwordHash: number) {
      this.checkPassword = (password: string) => {
        return hash(password) === passwordHash
      }
    }
  }

  const checker = new PasswordChecker(hash('s3cret'))
  checker.checkPassword('s3cret') // Returns true
}
