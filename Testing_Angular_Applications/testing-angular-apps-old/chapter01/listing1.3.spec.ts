import { Cat } from './listing1.1.src'; // importing the class Cat from the file

describe('Test Cat getter and setter', () => {
  it('The cat\'s name should be the set name, when name is set', () => {

    const cat = new Cat(); // instantiate the class, passing in empty string for default value

    cat.name = 'Gracie'; // test the set method

    expect(cat.name).toEqual('Gracie'); // test the get method

    // test the named function
    cat.toString(); //?
  });

  it('The cat\'s name should be the default name, when not set', () => {

    const cat = new Cat('Garip'); 

    cat.name; //?

    // the default name should be the instantiated name
    expect(cat.name).toEqual('Garip');

    cat.toString(); //?
  });

});
