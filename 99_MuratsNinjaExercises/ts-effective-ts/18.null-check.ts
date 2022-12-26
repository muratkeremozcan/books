// Avoid designs in which one value being null or not null is implicitly related to another value being null or not null.
// Push null values to the perimeter of your API by making larger objects either null or fully non-null.
// Consider creating a fully non-null class and constructing it when all values are available.

// Suppose you want to calculate the min and max of a list of numbers.
{
  function extent(nums: number[]) {
    let min, max
    for (const num of nums) {
      if (!min) {
        min = num
        max = num
      } else {
        min = Math.min(min, num)
        max = Math.max(max, num)
        // ~~~ Argument of type 'number | undefined' is not
        //     assignable to parameter of type 'number'
      }
    }
    return [min, max]
  }
  const [min, max] = extent([0, 1, 2]) //?
  const span = max - min
  // ~~~   ~~~ Object is possibly 'undefined'
}

// A better solution is to put the min and max in the same object and make this object either fully null or fully non-null:
{
  function extent(nums: number[]) {
    let result: [number, number] | null = null
    for (const num of nums) {
      if (!result) {
        result = [num, num]
      } else {
        result = [Math.min(num, result[0]), Math.max(num, result[1])]
      }
    }
    return result
  }

  // easier to use
  const range = extent([0, 1, 2]) //?
  if (range) {
    const [min, max] = range
    const span = max - min //?
  }
}

// A mix of null and non-null values can also lead to problems in classes.
// For instance, suppose you have a class that represents both a user and their posts on a forum:
{
  interface UserInfo {
    name: string
  }
  interface Post {
    post: string
  }
  declare function fetchUser(userId: string): Promise<UserInfo>
  declare function fetchPostsForUser(userId: string): Promise<Post[]>

  class UserPosts {
    user: UserInfo | null
    posts: Post[] | null

    constructor() {
      this.user = null
      this.posts = null
    }

    // While the two network requests are loading, the user and posts properties will be null.
    // At any time, they might both be null, one might be null, or they might both be non-null.
    // There are four possibilities. This complexity will seep into every method on the class.
    async init(userId: string) {
      return Promise.all([
        async () => (this.user = await fetchUser(userId)),
        async () => (this.posts = await fetchPostsForUser(userId)),
      ])
    }

    getUserName() {
      return this.user.name
    }
  }
}

// A better design would wait until all the data used by the class is available:
{
  interface UserInfo {
    name: string
  }
  interface Post {
    post: string
  }
  declare function fetchUser(userId: string): Promise<UserInfo>
  declare function fetchPostsForUser(userId: string): Promise<Post[]>

  class UserPosts {
    user: UserInfo
    posts: Post[]

    constructor(user: UserInfo, posts: Post[]) {
      this.user = user
      this.posts = posts
    }

    static async init(userId: string): Promise<UserPosts> {
      const [user, posts] = await Promise.all([fetchUser(userId), fetchPostsForUser(userId)])
      return new UserPosts(user, posts)
    }

    getUserName() {
      return this.user.name
    }
  }
}
