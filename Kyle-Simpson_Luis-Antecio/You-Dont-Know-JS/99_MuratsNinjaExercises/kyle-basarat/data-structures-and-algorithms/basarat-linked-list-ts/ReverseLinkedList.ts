import { default as LinkedList, LinkedListNode } from "././LinkedList";
// https://javascript.info/import-export

export default function reserveLinkedList<T>(list: LinkedList<T>) {
  let previous: LinkedListNode<T> | null = null;
  let current: LinkedListNode<T> | null = list.head;

  while (current !== null) {
    // copy before overwriting
    let next = current.next;

    // reverse
    current.next = previous;

    // step forward
    previous = current;
    current = next;
  }

  // swap head and tail
  [list.head, list.tail] = [list.tail, list.head];
}
