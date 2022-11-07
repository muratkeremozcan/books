import R from 'ramda'
{
  const words = ['de', 'lorean']

  {
    let camelCase = 'Marty and his '

    for (let i of words) {
      const head = i.charAt(0).toUpperCase()
      const tail = i.slice(1)
      camelCase += head + tail
    }

    camelCase //?
  }

  // fp refactor
  {
    const camelWord = (word: string) =>
      `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    /** reducer = (accumulator, current) => ... */
    const camelSentence = (sentence: string, word: string) =>
      `${sentence}${camelWord(word)}`

    const phrase = words.reduce(camelSentence, 'Marty and his ')
    phrase //?

    // ramda version
    const phrase2 = R.reduce(camelSentence, 'Marty and his ')(words) //?
    phrase2 //?
  }
}
