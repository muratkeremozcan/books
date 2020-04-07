
class Builder {
  constructor(specimenId) {
    this.specimenId = specimenId;
  }
  withSpeed(speed) {
    this.speed = speed;
    return this;
  }
  withPlumage(plumage) {
    this.plumage = plumage;
    return this;
  }
  build() {
    return this;
  }
}

// We can call build unto our newly constructed builder object ..
let raptorBuilder1 = new Builder('244E-C');
let raptor1 = raptorBuilder1.build();
// .. or pass in the builder object as an argument to Raptor. 
// Your call.
let raptorBuilder2 = new Builder('3998A-D');
let raptor2 = new Raptor(raptorBuilder2);