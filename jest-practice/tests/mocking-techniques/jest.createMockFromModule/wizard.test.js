const wizard = jest.createMockFromModule('./wizard').default;
wizard.isAuthorized = jest.fn(secret => secret === 'not wizard');

test('implementation created by jest.createMockFromModule', () => {
  expect(wizard.authorize.mock).toBeTruthy();
  expect(wizard.isAuthorized('not wizard')).toEqual(true);
});