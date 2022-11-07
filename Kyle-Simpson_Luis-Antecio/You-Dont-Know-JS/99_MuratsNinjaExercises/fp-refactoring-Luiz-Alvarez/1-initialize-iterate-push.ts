// Maintainable JavaScript with Functional Patterns | Luis Fernando Alvarez |Reliable Web Summit 2021
// FP refactoring
// https://www.youtube.com/watch?v=96x2KQExrSM&list=FL8lPlH6RrRLc4sYhAE6f3JQ&index=2

const words = ['Marty', 'Doc', 'Einstein']

{
  let capitalized = []

  for (let word of words) {
    capitalized.push(word.toUpperCase())
  }

  capitalized //?
}

// FP refactor ( no mutations )
{
  const upperCase = (word: string) => word.toUpperCase()
  const capitalized = words.map(upperCase) //?
}
