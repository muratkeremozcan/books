/**
 * Linked list node
 */
export type DoublyLinkedListNode<T> = {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
};

/**
 * Linked list for items of type T
 */
export default class DoublyLinkedList<T> {
  head: DoublyLinkedListNode<T> | null = null;
  tail: DoublyLinkedListNode<T> | null = null;

  /**
   * Adds an item in O(1), adds to the tail
   **/
  add(value: T): DoublyLinkedList<T> {
    const node: DoublyLinkedListNode<T> = {
      value,
      prev: null,
      next: null,
    };

    // if no head, we add the node as the head
    if (!this.head) {
      this.head = node;
    }

    // if we have a tail, we add the node as the new tail
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail; // link it back to the previous tail
    }

    // we set the tail to the new node
    this.tail = node;

    return this;
  }

  /**
   * FIFO removal in O(1), removes the head
   */
  dequeue(): T | null {
    if (!this.head) return null;

    const value = this.head.value;
    this.head = this.head.next;

    // if we removed the last node, we set the tail to null
    if (!this.head) {
      this.tail = null;
    } else {
      this.head.prev = null; // if there is a head, point it to null
    }

    return value;
  }

  /**
   * LIFO removal in O(1)
   */
  pop(): T | null {
    if (!this.tail) return null;

    const value = this.tail.value;
    this.tail = this.tail.prev;

    // if we removed the last node, we set the head to null
    if (!this.tail) {
      this.head = null;
    } else {
      this.tail.next = null; // if there is a tail, point it to null
    }

    return value;
  }

  /**
   * Returns an iterator over the values
   */
  *values() {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
