// There are three versions involved in an @types dependency: the library version, the @types version, and the TypeScript version.

// suppose a library is exporting a function, but not the types.
// How do we extract the types from the public API?
interface SecretName {
  first: string
  last: string
}

interface SecretSanta {
  name: SecretName
  gift: string
}

export function getGift(name: SecretName, gift: string): SecretSanta {
  return {
    name: {
      first: 'Dan',
      last: 'Van',
    },
    gift: 'MacBook Pro',
  }
}

// use ReturnType and Parameters!
type MySanta = ReturnType<typeof getGift> // SecretSanta
type MyName = Parameters<typeof getGift>[0] // SecretName

// Export types that appear in any form in any public method. Your users will be able to extract them anyway, so you may as well make it easy for them.
