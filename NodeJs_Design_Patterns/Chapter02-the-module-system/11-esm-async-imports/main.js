const SUPPORTED_LANGUAGES = ['el', 'en', 'es', 'it', 'pl']
const selectedLanguage = process.argv[2]

if (!SUPPORTED_LANGUAGES.includes(selectedLanguage)) {
  console.error('The specified language is not supported')
  process.exit(1)
}


// (2.2) dynamic imports happen async, so we can use the then() hook
// to get notified when the module is ready to be used
const translationModule = `./strings-${selectedLanguage}.js` // ①
import(translationModule)
  .then((strings) => {
    console.log(strings.HELLO)
  })
