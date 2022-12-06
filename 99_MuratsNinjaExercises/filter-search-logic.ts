import {indexOf, filter, find, curry, toLower, pipe, values} from 'ramda'

const heroes = [
  {
    id: 'HeroAslaug',
    name: 'Aslaug',
    description: 'warrior queen',
  },
  {
    id: 'HeroBjorn',
    name: 'Bjorn Ironside',
    description: 'king of 9th century Sweden',
  },
  {
    id: 'HeroIvar',
    name: 'Ivar the Boneless',
    description: 'commander of the Great Heathen Army',
  },
  {
    id: 'HeroLagertha',
    name: 'Lagertha the Shieldmaiden',
    description: 'aka Hlaðgerðr',
  },
  {
    id: 'HeroRagnar',
    name: 'Ragnar Lothbrok',
    description: 'aka Ragnar Sigurdsson',
  },
  {
    id: 'HeroThora',
    name: 'Thora Town-hart',
    description: 'daughter of Earl Herrauðr of Götaland',
  },
]
const textToSearch = 'ragnar'
interface Hero {
  id: string
  name: string
  description: string
}

Object.values(heroes[4]).find(
  (property: HeroProperty) => property === 'Ragnar Lothbrok',
)

find((property: HeroProperty) => property === 'Ragnar Lothbrok')(
  values(heroes[4]),
) //?

type HeroProperty = Hero['name'] | Hero['description'] | Hero['id']

/** returns a boolean whether the hero properties exist in the search field */
const searchExistsC = (searchField: string, searchProperty: HeroProperty) =>
  String(searchProperty).toLowerCase().indexOf(searchField.toLowerCase()) !== -1

const propertyExistsC = (searchField: string, item: Hero) =>
  Object.values(item).find((property: HeroProperty) =>
    searchExistsC(searchField, property),
  )

const searchPropertiesC = (data: Hero[], searchField: string) =>
  [...data].filter((item: Hero) => propertyExistsC(searchField, item))

searchPropertiesC(heroes, textToSearch) //?

// rewrite in ramda

const searchExists = (searchField: string, searchProperty: HeroProperty) =>
  indexOf(toLower(searchField), toLower(searchProperty)) !== -1

const propertyExists = curry((searchField: string, item: Hero) =>
  find((property: HeroProperty) => searchExists(searchField, property))(
    values(item),
  ),
)
// refactor propertyExists to use pipe
const propertyExistsNew = curry((searchField: string, item: Hero) =>
  pipe(
    values,
    find((property: HeroProperty) => searchExists(searchField, property)),
  )(item),
)

// refactor in better ramda
const searchProperties = (searchField: string, data: Hero[]) =>
  filter((item: Hero) => propertyExists(searchField, item), [...data])

const searchPropertiesBetter = (searchField: string, data: Hero[]) =>
  filter((item: Hero) => propertyExistsNew(searchField, item))(data)

const searchPropertiesBest = (searchField: string) =>
  filter(propertyExistsNew(searchField))

searchProperties(textToSearch, heroes) //?
searchPropertiesBetter(textToSearch, heroes) //?
searchPropertiesBest(textToSearch)(heroes) //?
