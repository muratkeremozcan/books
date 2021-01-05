
import SoundPlayerConsumer from './sound-player-consumer';
import SoundPlayer from './sound-player';


// mocking with module-factory pattern
// we are testing sound-player-consumer.js and mocking sound-player.js which the consumer depends on
// (1) use jest.fn() for the functions in the mocked module 
// (2) use jest.mock(path, moduleFactoryFn) :  the moduleFactoryFn uses and returns jest.fn().mockImplementation( fn({objectWithFns}) )
//  which itself returns an object with functions in the module
let mockPlaySoundFile = jest.fn();

jest.mock('./sound-player', () => {
  return jest.fn().mockImplementation(() => {
    return { playSoundFile: mockPlaySoundFile };
  });
  // note: jest.fn().mockImplementation(function implementation() {..})  is interchangeable with jest.fn(function implementation() {..})
  // return jest.fn(() => {
  //   return { playSoundFile: mockPlaySoundFile };
  // });
});

describe('auto-mock does not really work, so this is the solution', () => {

  beforeEach(() => {
    SoundPlayer.mockClear();
    mockPlaySoundFile.mockClear();
  });

  it('The consumer should be able to call new() on SoundPlayer', () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    expect(soundPlayerConsumer).toBeTruthy(); // Constructor ran with no errors
  });

  it('We can check if the consumer called the class constructor', () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    expect(SoundPlayer).toHaveBeenCalled();
  });

  it('We can check if the consumer called a method on the class instance', () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    const coolSoundFileName = 'song.mp3';

    soundPlayerConsumer.playSomethingCool();
    expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
  });

});