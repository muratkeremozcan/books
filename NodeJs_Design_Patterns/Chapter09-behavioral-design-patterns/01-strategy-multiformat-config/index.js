import { Config } from './config.js'
import { jsonStrategy, iniStrategy } from './strategies.js'

async function main () {
  const iniConfig = new Config(iniStrategy)
  await iniConfig.load('samples/conf.ini')
  iniConfig.set('book.nodejs', 'design patterns')
  await iniConfig.save('samples/conf_mod.ini')

  const jsonConfig = new Config(jsonStrategy)
  await jsonConfig.load('samples/conf.json')
  jsonConfig.set('book.nodejs', 'design patterns')
  await jsonConfig.save('samples/conf_mod.json')
}

main()

// We defined only one Config class, which implements the common parts of our configuration manager
// then, by using different strategies for serializing and deserializing data, 
// we created different Config class instances supporting different file formats.
