const heroes = [
  {
    id: "HeroAslaug",
    name: "Aslaug",
    description: "warrior queen",
  },
  {
    id: "HeroBjorn",
    name: "Bjorn Ironside",
    description: "king of 9th century Sweden",
  },
  {
    id: "HeroIvar",
    name: "Ivar the Boneless",
    description: "commander of the Great Heathen Army",
  },
  {
    id: "HeroLagertha",
    name: "Lagertha the Shieldmaiden",
    description: "aka Hlaðgerðr",
  },
  {
    id: "HeroRagnar",
    name: "Ragnar Lothbrok",
    description: "aka Ragnar Sigurdsson",
  },
  {
    id: "HeroThora",
    name: "Thora Town-hart",
    description: "daughter of Earl Herrauðr of Götaland",
  },
];

const textToSearch = "ragnar";

const searchExists = (searchField, searchProperty) => {
  return searchProperty.toLowerCase().indexOf(searchField.toLowerCase()) !== -1;
};

const searchPropertiesOriginal = (data, searchField) => {
  return [...data].filter((item) => {
    return searchExists(searchField, item.name);
  });
};

const searchProperties = (data, searchField) => {
  return [...data].filter((item) => {
    // const itemProperties = Object.getOwnPropertyNames(item);
    const itemProperties = Object.values(item);
    return itemProperties.find((property) => {
      return searchExists(searchField, property);
    });
  });
};

searchPropertiesOriginal(heroes, textToSearch); //?

searchProperties(heroes, textToSearch); //?
