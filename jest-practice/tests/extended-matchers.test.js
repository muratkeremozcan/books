
describe('extended matchers', () => {

  test('toSatisfy(customMatcher)', () => {
    const greaterThanOneButNotThree = n => n > 1 && n !== 3;

    expect(100).toSatisfy(greaterThanOneButNotThree);
    expect(0).not.toSatisfy(greaterThanOneButNotThree);
    expect(3).not.toSatisfy(greaterThanOneButNotThree);
  });

  test('toSatisfyAll() :  when you want to use a custom matcher by supplying a predicate function that returns a Boolean for all values in an array', () => {
    expect([1,3,5,7]).toSatisfyAll(isOdd);
    expect([1,3,4,5,7]).not.toSatisfyAll(isOdd);
  });



});