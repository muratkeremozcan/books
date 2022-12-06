/**
 * Linked list node
 */
export type LinkedListNode<T> = {
  value: T;
  next: LinkedListNode<T> | null;
};

/**
 * Linked list for items of type T
 */
export default class LinkedList<T> {
  head: LinkedListNode<T> | null = null;
  tail: LinkedListNode<T> | null = null;

  /**
   * Adds an item in O(1), adds to the tail
   **/
  add(value: T): LinkedList<T> {
    const node: LinkedListNode<T> = {
      value,
      next: null,
    };

    // if no head, we add the node as the head
    if (!this.head) {
      this.head = node;
    }

    // if we have a tail, we add the node as the new tail
    if (this.tail) {
      this.tail.next = node;
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
