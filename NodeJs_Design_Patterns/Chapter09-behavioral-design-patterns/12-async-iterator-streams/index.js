import split from 'split2'

async function main () {
  // we take the stdin stream of the current process and we pipe it into the split() transform stream, 
  // which will emit a new chunk when it finds a newline character
  const stream = process.stdin.pipe(split())
  
  for await (const line of stream) {
    console.log(`You wrote: ${line}`)
  }
}

main()
