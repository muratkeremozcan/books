import DoublyLinkedList from "./DoublyLinkedList";

test("basic", () => {
  const list = new DoublyLinkedList<number>();

  list.add(1);
  list.add(10);
  list.add(5);

  // we can yield and array from a generator
  Array.from(list.values()); //?

  expect(Array.from(list.values())).toEqual([1, 10, 5]);

  expect(list.dequeue()).toBe(1);
  expect(Array.from(list.values())).toEqual([10, 5]);

  expect(list.dequeue()).toBe(10);
  expect(list.dequeue()).toBe(5);
  expect(list.dequeue()).toBeNull();

  expect(Array.from(list.values())).toMatchObject([]);

  list.add(5);
  list.add(10);
  list.add(1);
  expect(Array.from(list.values())).toMatchObject([5, 10, 1]);

  expect(list.pop()).toBe(1);
  expect(list.pop()).toBe(10);
  expect(list.pop()).toBe(5);
  expect(list.pop()).toBeNull();
  expect(Array.from(list.values())).toMatchObject([]);
});
