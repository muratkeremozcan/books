import Dollar from "./dollar";
test("#times amount", () => {
  expect(true).toBe(true);

  const fiver = new Dollar(10);
  const tenner = fiver.times(2);
  expect(tenner.amount).toBe(20);
});
