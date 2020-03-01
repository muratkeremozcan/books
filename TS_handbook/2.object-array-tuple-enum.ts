{ // object type & type inference

  // const person: {
  //   name: string,
  //   age: number
  // } = {
  const person = { // better to infer it, but the above object type is what's happening behind the scenes
    name: 'Murat',
    age: 36
  };

  // hover over to see inference
  person.name; //?
}


{ // array type, union types

  const person = {
    name: 'Max',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
    role: [2, 'author'] // TS can infer union type too: (string | number)[]
  }

  // TS knows that hobbies is a string[] and iterates seamlessly
  for (let hobby of person.hobbies) {
    hobby.toUpperCase(); //?
  }
}


{ // tuple type: provides even more strict array typing
  
  const person: {
    name: string,
    age: number,
    hobbies: string[],
    role: [number, string, boolean]
  } = {
    name: 'Max',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
    role: [2, 'author', true]
  }

  person.role = [10, 'someRole', true];
  person; //?
}


{ // enum type: helps with not having to memorize the appropriate values an argument can have (mapped values)
  
  enum Role {ADMIN, READ_ONLY, AUTHOR}; // uppercase is a convention with enum
  // enum Role {ADMIN = 5, READ_ONLY = 'readOnly', AUTHOR = 200}; // can have non-default values as well

  const person = {
    name: 'Max',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
    role: Role.AUTHOR
  }

  if (person.role === Role.AUTHOR) {
    console.log('user is author');
  }


}