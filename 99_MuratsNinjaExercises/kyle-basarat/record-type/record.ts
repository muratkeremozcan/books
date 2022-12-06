// https://www.youtube.com/watch?v=-yvPxBaCLM0

// a record is a data structure that stores related properties. Ex: relational database table
// in JS a record type would be expressed as an object with key value pairs
// TS provides a utility type for it

// Record<key, value>
// given a key of string type, give us a value of object type, with name & role properties as strings
type Persons = Record<string, { name: string; role: string }>;
// same thing, but record provides additional features (shown later on)
type PersonsVerbose = { [key: string]: { name: string; role: string } };

let persons: Persons = {};

persons["000"] = { name: "John", role: "admin" };
persons["111"] = { name: "Jane", role: "owner" };
persons.aaa = { name: "Jack", role: "user" };

// if we try to store a value that doesn't fit {name: string, role: string}, we get a TS error
persons["222"] = { name: "Dima" };

persons; //?

////////////// additional features of record type
// 1. can utilize a union types, not only primitive types

type Roles = "admin" | "owner" | "user";

// union type as a value property
let persons2: Record<string, { name: string; role: Roles }> = {};
persons2["000"] = { name: "John", role: "admin" };
persons2["111"] = { name: "Jane", role: "owner" };
persons2.aaa = { name: "Jack", role: "user" };

// union type as a key property
let peopleWithRoles: Record<Roles, string[]> = {
  owner: ["Jane", "June"],
  admin: ["John"],
  user: ["Dima"],
};
// if any of the keys is missing, TS will throw an error
let peopleWithRoles2: Record<Roles, string[]> = {
  owner: ["Jane", "June"],
  admin: ["John"],
  // user: ["Dima"],
};

// 2. we can use the Record utility as a shorthand for creating objects
// in simple cases, it is not so useful
type Point = Record<"x" | "y", number>;

// in complex cases, it can make it a one liner

// long version
type PageInfo = {
  id: string;
  title: string;
};

type PagesVerbose = {
  home: PageInfo;
  services: PageInfo;
  about: PageInfo;
  contact: PageInfo;
};

// one liner version
type Pages = Record<"home" | "services" | "about" | "contact", PageInfo>;
