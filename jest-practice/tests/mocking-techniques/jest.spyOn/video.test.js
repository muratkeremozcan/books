// jest.spyOn() : creates a mock function similar to jest.fn() but also tracks calls to object[methodName]

const video = require('./video').video;
const audio = require('./video').audio;

describe('jest.spyOn(object, methodName, accessType?)', () => {

  test('spyOn(object, methodName)', () => {
    const spy = jest.spyOn(video, 'play');
    video.play();

    expect(spy).toHaveBeenCalled();
    expect(video.play()).toBe(true);
  });

  test('spyOn(object, methodName, \'set\')', () => {
    const spy = jest.spyOn(audio, 'volume', 'set');

    audio.volume = 100;

    expect(spy).toHaveBeenCalled();
  });

  test('spyOn(object, methodName, \'get\')', () => {
    const spy = jest.spyOn(audio, 'volume', 'get');

    audio.volume;

    expect(spy).toHaveBeenCalled();
  });
});