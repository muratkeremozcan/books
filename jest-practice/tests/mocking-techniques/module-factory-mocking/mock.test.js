import SoundPlayerConsumer from './sound-player-consumer';
import SoundPlayer from './sound-player';


let mockPlaySoundFile = jest.fn();

// jest.mock(path, moduleFactory) takes a module factory argument. A module factory is a function that returns the mock.
jest.mock('./sound-player', () => {
  return jest.fn().mockImplementation(() => {
    return { playSoundFile: mockPlaySoundFile };
  });
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