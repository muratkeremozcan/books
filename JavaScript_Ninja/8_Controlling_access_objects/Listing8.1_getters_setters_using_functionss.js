function Ninja() {
  let skillLevel; // private variable
  this.getSkillLevel = () => skillLevel; // getter method, accessing private skillLevel variable
  this.setSkillLevel  = value => { // setter method to control values to assign to skillLevel
    console.log('setting skill level \n'); // we can when the code gets or sets
    skillLevel = value;
  };
}
const ninja =  new Ninja();

ninja.setSkillLevel(100); // sets value
console.log(ninja.getSkillLevel()); // gets value

console.log(ninja.skillLevel); // cannot access private variable