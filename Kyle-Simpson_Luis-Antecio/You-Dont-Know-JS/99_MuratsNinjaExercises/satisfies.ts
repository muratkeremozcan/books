// TS satisfies operator, try it with version 4.9
{
  // you have a type `City` that can be
  // either `CityName` or `CityCoordinates`
  type City = CityName | CityCoordinates

  // `CityName` is a string representing
  // one of these cities
  type CityName = 'New York' | 'Mumbai' | 'Lagos'

  // `CityCoordinates` is an object with
  // `x` and `y` properties denoting
  // the coordinates of your locatin
  type CityCoordinates = {
    x: number
    y: number
  }

  // ...and the `User` type has
  // `birthLocation` and `currentLocation`,
  // both of which are you type `Location`
  type User = {
    birthCity: City
    currentCity: City
  }

  const user: User = {
    birthCity: 'Mumbai',
    currentCity: {x: 6, y: 3},
  }

  const birthCityUppercase = user.birthCity.toUpperCase()

	// try this with TS 4.9
  const user2 = {
    birthCity: "Mumbai",
    currentCity: { x: 6, y: 3 },
  } satisfies User

  const birthCityUppercase2 = user2.birthCity.toUpperCase();
}
