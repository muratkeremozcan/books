function Node(value) { // Node object — represents the element in Linked List. Containt DATA, nextListNodeObject, prevListNodeObject
  this.value = value;
  this.next = undefined;
  this.prev = undefined;
}
//  if the Node object is a head of a doubly list, its previous pointer will be null. Same thing applies to the tail of a doubly list, its next pointer will be null.

function DLinkedList() {
  var head = undefined;
  var tail = undefined;
  var length = 0;

  return {
    insert: function (item) {
      if (!item) return; // Protection check - make sure item to insert is valid.

      var node = new Node(item); // Create new Node to wrap around the item data

      if (head) { // if head exists (the Node being inserted is not the head, there is already a head)
        node.next = head; // update the node next pointer to point to old head (circular)
        head.prev = node; // Update the previous pointer of old head (circular)
      }
       // Update the head & tail of the list and length of the list.
      head = node;

      if (!tail) {
        tail = node;
      }

      length++;
    },
    delete: function (value) {
      var curr = head; // Start from head of the list

      while (curr) { // Iterate through list to find the matching node
        if (curr.value === value) {
          var prev = curr.prev,
            next = curr.next;

          if (prev) { // Update the pointers
            prev.next = next;
          } else {
            head = next; // If matched node is the head
          }

          if (next) {
            next.prev = prev;
          } else {
            tail = prev; // If matched node is the tail
          }

          length--;
          break;
        }

        curr = curr.next;
      }
    },
    search: function (value) {
      var curr = head;
      var found = undefined;

      while (curr) {
        if (curr.value === value) {
          found = curr;
          break;
        }

        curr = curr.next;
      }

      return found;
    },
    get size() {
      return length;
    },
    print: function () {
      var result = [];

      var curr = head;
      while (curr) {
        result.push(curr.value);

        curr = curr.next;
      }

      return result;
    }
  }
}

/** When to use
 * We need to split or combine different list together, because splitting and joining lists is very efficient.
 * Insertions and Deletions are simpler than array . Use We need to do a lot of insertions and removals
 * Searching is not important
 * For large data, moving pointers is easier and faster than moving items themselves
 * Overflow on list will never occur because it doesn’t require a contiguous block of memory
 ** CONS
 * Linked List requires extra space for storing pointers.
 * Can’t really randomly access an item in the list — there is no real index to access item like in array. Need to go through it
 * Arrays allow better memory locality and cache performance.
 *
 * DELTA : In an array the elements are indexed
 * PRO: Insertions and deletions are at constant time O(1), except inserting at the end
 */