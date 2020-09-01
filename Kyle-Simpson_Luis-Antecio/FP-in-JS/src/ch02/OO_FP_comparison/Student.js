import Person from './Person';

export default class Student extends Person {
  constructor(ssn, firstName, lastName, school, birthYear= null, city = null) {
    super(ssn, firstName, lastName, birthYear, city)
    this._school = school;
  }

  get school() { 
    return this._school
  }

  set school(school) {
    this._school = school;
  }

  studentsInSameCity(friends) {
    // uses super to request data from Person class
    var closeFriends = super.peopleInSameCity(friends);
    var result = [];
    for (let idx in closeFriends) {
      var friend = closeFriends[idx];
      if (friend.school === this._school) {
        result.push(friend);
      }
    }
    return result;
  }
}