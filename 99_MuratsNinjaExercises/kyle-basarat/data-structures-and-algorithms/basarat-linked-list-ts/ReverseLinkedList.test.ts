import LinkedList from "./LinkedList";
import reverseLinkedList from "./ReverseLinkedList";

test("in place", () => {
  const list = new LinkedList<number>();
  list.add(1);
  list.add(2);
  list.add(3);
  list.add(4);
  reverseLinkedList(list); //?
  expect(Array.from(list.values())).toMatchObject([4, 3, 2, 1]);
});
