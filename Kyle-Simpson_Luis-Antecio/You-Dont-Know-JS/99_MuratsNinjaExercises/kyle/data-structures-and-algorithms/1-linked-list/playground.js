// a manual playground
const LinkedList = require("./LinkedList");

const ll = new LinkedList();

ll.insertAtHead(10);
ll; //?

ll.insertAtHead(20);
ll; //?
ll.print(); //?

const ll2 = new LinkedList().llFromArray([10, 20, 30, 40]);
ll2.getByIndex(1); //?
ll2.getByIndex(2); //?

ll2.print(); //?

ll2.insertAtIndex(1, 15);

ll2.print(); //?
