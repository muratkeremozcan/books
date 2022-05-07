// https://www.youtube.com/watch?v=RcvQagxK_9w&list=WL&index=4
// think of a linked list like an array, where instead of indexes each item points to another item in the list
// insertion is easy & efficient, getting an element is not

// Singly Linked List
// (headNode)5 -> 10 -> 15 -> 20|

// Doubly Linked List
// |5 <-> 10 <-> 15 <-> 20|

// Circular Linked List
// (headNode)5 -> 10 -> 15 -> 20 -> (headNode)5

// https://www.youtube.com/watch?v=gJjPWA8wpQg

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  /** Creates a new node, give it the value, set the next node as the previous head, increase the list size */
  insertAtHead(value) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    this.length++;

    return this;
  }

  removeHead() {
    // our new head is moved to the next node
    this.head = this.head.next;
    this.length--;

    return this;
  }

  getByIndex(index) {
    if (index < 0 || index >= this.length) return null;

    // returns the element at the index
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  insertAtIndex(index, value) {
    if (index < 0 || index > this.length) return null;

    if (index === 0) this.insertAtHead(value);

    // find the element at that index
    const prev = this.getByIndex(index - 1);
    if (prev == null) return null;
    // create a new element, our next node is the next node of the previous node
    prev.next = new LinkedListNode(value, prev.next);
    // expand our list
    this.length++;

    return this;
  }

  removeAtIndex(index) {
    if (index < 0 || index >= this.length) return null;

    if (index === 0) this.removeHead();

    const prev = this.getByIndex(index - 1);
    if (prev == null) return null;

    // point the next of the previous node to the next of the next node
    prev.next = prev.next.next;

    this.length--;

    return this;
  }

  print() {
    let output = "";
    let current = this.head;
    while (current) {
      output = `${output}${current.value} -> `;
      current = current.next;
    }
    return `${output}null`;
  }

  llFromArray([...arr]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      this.insertAtHead(arr[i]);
    }
    return this;
  }
}

// LinkedList.fromArr = function (...arr) {
// 	const ll = new LinkedList();
// 	for (let i = arr.length - 1; i >= 0; i--) {
// 		ll.insertAtHead(arr[i]);
// 	}
// 	return ll;
// };

class LinkedListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

module.exports = LinkedList;
