interface Person {
  name: string;
}
const people = ["alice", "bob", "jan"].map((name): Person => ({ name }));
// { name: string; }[]... but we want Person[]
