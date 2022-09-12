// replace an item in an array
let users = [
  { id: 1, firstName: "John", lastName: "Ken" },
  { id: 2, firstName: "Robin", lastName: "Hood" },
  { id: 3, firstName: "William", lastName: "Cook" },
];

const editedUser = { id: 2, firstName: "Michael", lastName: "Angelo" };


users = users.map((u) => (u.id !== editedUser.id ? u : editedUser));

users; //?