{
  interface Address {
    street: string
    city?: string
  }

  interface User {
    name: string
    address: Address | undefined
    meta: Record<string, string>
  }

  interface SuperUser extends User {
    permissions: string[]
  }

  class UserRepository {
    private users: User[]

    constructor() {
      this.users = [
        // Do not change the data. Let's assume it comes from the backend.
        {
          name: 'John',
          address: undefined,
          meta: {created: '2019/01/03'},
        },
        {
          name: 'Anne',
          address: {street: 'Warsaw'},
          meta: {
            created: '2019/01/05',
            modified: '2019/04/02',
          },
        },
      ]
    }

    // `user` with given `id` might not exist, so marking the return type as possibly undefined
    getUser(id: number): User {
      return this.users[id]
    }

    getStreets() {
      return this.users
        .map(user => user.address?.street)
        .filter(street => street !== undefined)
    }

    forEachUser(action: (user: User) => void) {
      this.users.forEach(user => action(user))
    }
  }

  const userRepository = new UserRepository()

  userRepository
    .getStreets()
    .map(street => street?.toUpperCase())
    .join(', ') //?

  userRepository.getUser(0)?.meta.modified //?
  userRepository.getUser(1)?.meta.modified //?
}

/* before
interface Address {
  street: string;
  city?: string;
}

interface User {
  name: string;
  address: Address;
  meta: Record<string, string>;
}

interface SuperUser extends User {
  permissions: string[];
}

class UserRepository {
  private users: User[];

  init() {
    this.users = [
      // Do not change the data. Let's assume it comes from the backend.
      {
        name: "John",
        address: undefined,
        meta: { created: "2019/01/03" }
      },
      {
        name: "Anne",
        address: { street: "Warsaw" },
        meta: {
          created: "2019/01/05",
          modified: "2019/04/02"
        }
      }
    ];
  }

  getUser(id) {
    return this.users[id];
  }

  getCities() {
    return this.users
      .filter(user => user.address.city)
      .map(user => user.address.city);
  }

  forEachUser(action: (user: User) => void) {
    this.users.forEach(user => action(user));
  }
}

const userRepository = new UserRepository();

console.log(userRepository.getUser(1).address.city.toLowerCase());

console.log(
  userRepository
    .getCities()
    .map(city => city.toUpperCase())
    .join(", ")
);

console.log(new Date(userRepository.getUser(0).meta.modfified).getFullYear());

*/
