{
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
  interface Hero {
    id: string;
    name: string;
    description: string;
  }

  type HeroProperty = Hero["name"] | Hero["description"] | Hero["id"];
  /** returns a boolean whether the hero properties exist in the search field */
  const searchExists = (searchField: string, searchProperty: HeroProperty) =>
    String(searchProperty).toLowerCase().indexOf(searchField.toLowerCase()) !==
    -1;

  const searchProperties = (data: Hero[], searchField: string) =>
    [...data].filter((item: Hero) =>
      Object.values(item).find((property: HeroProperty) =>
        searchExists(searchField, property)
      )
    );

  searchProperties(heroes, textToSearch); //?
}
