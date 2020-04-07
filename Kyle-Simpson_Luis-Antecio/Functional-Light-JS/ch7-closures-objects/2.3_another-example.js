// The inner function printStudent() closes over three variables: name, major, and gpa. 
// It maintains this state wherever we transfer a reference to that function

function StudentRecord_closureStyle(name, major, gpa) {
  return function printStudent() {
    return ` ${name}, Major: ${major}, GPA: ${gpa.toFixed(1)}`;
  };
}
StudentRecord_closureStyle('Kyle', 'CS', 4)(); //?


// The student() function – technically referred to as a “bound function” – 
// has a hard-bound this reference to the object literal we passed in, 
// such that any later call to student() will use that object for its this, and thus be able to access its encapsulated state.
function StudentRecord_objectThisStyle() {
  return ` ${this.name}, Major: ${this.major}, GPA: ${this.gpa.toFixed(1)}`;
}
StudentRecord_objectThisStyle.bind({
  name: 'Kyle',
  major: 'CS',
  gpa: 4
})(); //?