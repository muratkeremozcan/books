import { StrengthPipe } from './strength.pipe';

// [9] pipe tests are isolated. No need for boilerplate; just instantiate and test like a plain JS class

describe('StrengthPipe', () => {
  let pipe;
  let pipeXform;

  beforeEach(() => {
    pipe = new StrengthPipe();
    pipeXform = (num) => pipe.transform(num);
  });

  it('should display weak if strength is 5', () => {
    expect(pipeXform(5)).toBe('5 (weak)');
  });

  it('should display strong if strength is 10', () => {
    expect(pipeXform(10)).toBe('10 (strong)');
  });

  it('should display unbelievable if strength is 20', () => {
    expect(pipeXform(20)).toBe('20 (unbelievable)');
  });
});
