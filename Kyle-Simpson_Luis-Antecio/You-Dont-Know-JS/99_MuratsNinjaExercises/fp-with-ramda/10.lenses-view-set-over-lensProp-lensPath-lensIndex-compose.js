import * as R from 'ramda'

// lenses let you “zoom in” on a particular piece of a data structure
{
  const person = {
    firstName: 'Bobo',
    lastName: 'Flakes',
  }

  const firstNameLens = R.lensProp('firstName') // finds any object's firstName property

  // view and set a property
  R.view(firstNameLens, person) //?
  R.set(firstNameLens, 'Bobo Jr.', person) //?
  // change a property using a function
  R.over(firstNameLens, R.concat('Mr. '), person) //?

  // person is unchanged
  person //?
}

// nested properties
{
  const person = {
    firstName: 'Bobo',
    lastName: 'Flakes',
    company: 'Fake Inc.',
    position: {
      title: 'Front-End Developer',
      department: {
        name: 'Product',
        departmentManager: {
          firstName: 'Bobo Sr.',
          lastName: 'Flax',
        },
      },
    },
  }

  // using vanilla JS, it is hard to overwrite a property without mutating the original object
  const correctPerson = {
    ...person,
    position: {
      ...person.position,
      department: {
        ...person.position.department,
        departmentManager: {
          ...person.position.department.departmentManager,
          lastName: 'Flakes',
        },
      },
    },
  }

  person.position.department.departmentManager.lastName //?
  const correctedLastName =
    correctPerson.position.department.departmentManager.lastName //?
  console.log({correctedLastName}) //?

  // using R.lens

  const managerLastNameLens = R.lensPath([
    'position',
    'department',
    'departmentManager',
    'lastName',
  ])

  // since it’s curried, a single lens can be used to view and update a property.
  // We used managerLastNameLens in both set and view.
  const correctPersonR = R.set(managerLastNameLens, 'Flakes', person) //?
  const correctPersonRLastName = R.view(managerLastNameLens, correctPersonR) //?

  correctPersonRLastName //?
}

// with arrays we use R.lensIndex instead of R.lensProp
{
  const person = {
    firstName: 'Bobo',
    lastName: 'Flakes',
    friends: [
      {
        firstName: 'Clark',
        lastName: 'Kent',
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
      },
      {
        firstName: 'Barry',
        lastName: 'Allen',
      },
    ],
  }

  const getThirdFriend = R.lensIndex(2)
  R.view(getThirdFriend, person.friends) //?

  // composing lenses
  // person.friends reference isn't nice, we just want to pass in person
  // Compose lenses to handle objects and arrays at the same time (lensProp + lensIndex).
  // compose lets you write lenses left-to-right

  const getThirdFriendP = R.compose(
    R.lensProp('friends'),
    // R.tap((fn) => {
    // fn(person.friends) //?
    // fn.toString() //?
    // }),
    R.lensIndex(2),
  )

  R.view(getThirdFriendP, person) //?
}

// longhand lenses
{
  // R.prop  lets you get object properties.
  // R.assoc lets you set them without mutating the original object.
  // Since lenses need a getter and a setter to perform their duties,
  // prop and assoc make the perfect combination to immutably handle and change lenses
  const name = R.lensProp('name')
  R.view(name, {name: 'Bobo'}) //?

  const name2 = R.lens(R.prop('name'), R.assoc('name'))
  R.view(name2, {name: 'Bobo'}) //?
}
