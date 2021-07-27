import { promises as fs } from 'fs'
import objectPath from 'object-path'

export class Config {
  // In the constructor, we create an instance variable called data to hold the configuration data.
  // Then we also store formatStrategy, which represents the component that we will use to parse and serialize the data.
  constructor (formatStrategy) {
    this.data = {}
    this.formatStrategy = formatStrategy
  }

  // We provide two methods, set() and get(), to access the configuration properties using a dotted path notation 
  // (for example, property.subProperty) by leveraging a library called object-path (nodejsdp.link/object-path).
  get (configPath) {
    return objectPath.get(this.data, configPath)
  }

  set (configPath, value) {
    return objectPath.set(this.data, configPath, value)
  }

  // The load() and save() methods are where we delegate, respectively, the de-serialization and serialization of the data to our strategy.
  // This is where the logic of the Config class is altered based on the formatStrategy passed as an input in the constructor.
  async load (filePath) {
    console.log(`Deserializing from ${filePath}`)
    this.data = this.formatStrategy.deserialize(
      await fs.readFile(filePath, 'utf-8')
    )
  }

  async save (filePath) {
    console.log(`Serializing to ${filePath}`)
    await fs.writeFile(filePath,
      this.formatStrategy.serialize(this.data))
  }
}
