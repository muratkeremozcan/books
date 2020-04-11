export default class Person {
  constructor(ssn, firstname, lastName, birthYear = null, city = null) {
    this._ssn = ssn;
    this._firstname = firstname;
    this._lastname = lastName;
    this._birthYear = birthYear;
    this._city = city;
  }

  get ssn() {
    return this._ssn;
  }

  get firstname() {
    return this._firstname;
  }

  get lastname() {
    return this._lastname;
  }

  get birthYear() {
    return this._birthYear;
  }

  get city() {
    return this._city;
  }

  get fullname() {
    return `${this._firstname} ${this._lastname}`
  }

  // using setter methods is an easy way to create objects that have different properties
  // without having to use long constructors
  set ssn(ssn) {
    this._ssn = ssn;
  }

  set firstname(firstname) {
    this._firstname = firstname;
  }

  set lastname(lastname) {
    this._lastname = lastname;
  }

  set birthYear(birthYear) {
    this._birthYear = birthYear;
  }

  set city(city) {
    this._city = city;
  }

  peopleInSameCity(friends) {
    var result = [];
    for (let idx in friends){
      var friend = friends[idx];
      if (this.city === friend.city) {
        result.push(friend);
      }
    }
    return result;
  }
}