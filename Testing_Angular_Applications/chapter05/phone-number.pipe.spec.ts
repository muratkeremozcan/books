// [5] PIPE TESTING Listing 5.1 5.2 5.3. 5.4 5.5. 5.6
// A pipe takes a value as input, transforms and returns the value
// each pipe in angular has a method named transform, responsible for formatting the pipe's input returning a result
// when testing pipes you are testing the transform method

// Pipe is a pure function (its output only depends on its input) it does not need any of the Angular testing dependencies
// a function who can do something other than return a value is said to have a side effect
import { PhoneNumberPipe } from './phone-number.pipe';

describe('PhoneNumberPipe Tests', () => {
  let phoneNumber: PhoneNumberPipe;

  beforeEach(() => {
    phoneNumber = new PhoneNumberPipe(); // instantiate before each test
  });

  afterEach(() => {
    phoneNumber = null; // teardown after each test
  });

  describe('default behavior', () => {
    it('should transform the string or number into the default phone number format', () => {
      const testInputPhoneNumber = '7035550123';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber);
      const expectedResult = '(703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });
    it('should not display anything if the length is not 10 digits', () => {
      const testInputPhoneNumber = '703555012';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber);
      const expectedResult = '';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

  });

  describe('phone number format tests', () => {
    it('should format the phone number using the dots format', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'dots';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format);
      const expectedResult = '703.555.0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

    it('should format the phone number using the default format', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'default';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format);
      const expectedResult = '(703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

    it('should format the phone number using the hyphens format', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'default';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format);
      const expectedResult = '(703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

    it('should format the phone number using the unrecognized format', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'uylasildfhla';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format);
      const expectedResult = '(703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });
  });

  describe('country code parameter tests', () => {
    it('should add respective country code', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'default';
      const countryCode = 'us';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format, countryCode);
      const expectedResult = '+1 (703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

    it('should not add anything if the country code is unrecognized', () => {
      const testInputPhoneNumber = '7035550123';
      const format = 'default';
      const countryCode = 'zz';
      const transformedPhoneNumber = phoneNumber.transform(testInputPhoneNumber, format, countryCode);
      const expectedResult = '(703) 555-0123';

      expect(transformedPhoneNumber).toBe(expectedResult);
    });

  });

});
