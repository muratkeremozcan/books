const { expect } = require("chai");
const LinkedList = require("./LinkedList");

describe("#insertAtHead", () => {
  test("it adds the element to the beginning of the list", () => {
    const ll = new LinkedList();
    ll.insertAtHead(10);
    const oldHead = ll.head;
    ll.insertAtHead(20);

    expect(ll.head.value).to.equal(20);
    expect(ll.head.next).to.equal(oldHead);
    expect(ll.length).to.eq(2);
  });
});

describe("#getByIndex", () => {
  let ll;

  beforeEach(() => {
    ll = new LinkedList().llFromArray([10, 20, 30, 40]);
  });

  test("should return null with index less than 0", () => {
    expect(ll.getByIndex(-1)).to.eq(null);
  });

  test("should return null with index greater than length", () => {
    expect(ll.getByIndex(4)).to.eq(null);
  });

  test("should return the head with index 0", () => {
    expect(ll.getByIndex(1).value).to.eq(20);
  });

  test("should return the value with an existing index", () => {
    expect(ll.getByIndex(2).value).to.eq(30);
  });
});

describe("#print", () => {
  test("should print the linked list", () => {
    const ll = new LinkedList().llFromArray([10, 20, 30, 40]);

    expect(ll.print()).to.eq("10 -> 20 -> 30 -> 40 -> null");
  });
});

describe("#insertAtIndex", () => {
  let ll;

  beforeEach(() => {
    ll = new LinkedList().llFromArray([10, 20, 30, 40]);
  });

  it("should not insert at index less than 0", () => {
    expect(ll.insertAtIndex(-1, -10)).to.eq(null);
  });

  it("should not insert with an index greater than length", () => {
    expect(ll.insertAtIndex(5, 50)).to.eq(null);
  });

  it("should insert with index 0", () => {
    ll.insertAtHead(0);

    expect(ll.print()).to.eq("0 -> 10 -> 20 -> 30 -> 40 -> null");
  });

  it("should insert with index at the given index", () => {
    ll.insertAtIndex(3, 35);

    // ll.print(); //?
    expect(ll.print()).to.eq("10 -> 20 -> 30 -> 35 -> 40 -> null");
  });

  it("should insert in the beginning", () => {
    ll.insertAtIndex(0, 5);

    expect(ll.print()).to.eq("5 -> 10 -> 20 -> 30 -> 40 -> null");
  });
});

describe("#removeAtIndex", () => {
  let ll;

  beforeEach(() => {
    ll = new LinkedList().llFromArray([10, 20, 30, 40]);
  });

  it("should not remove at index less than 0", () => {
    expect(ll.removeAtIndex(-1, -10)).to.eq(null);
  });

  it("should not remove with an index greater than length", () => {
    expect(ll.removeAtIndex(5, 50)).to.eq(null);
  });

  it("should remove with index at the given index", () => {
    ll.removeAtIndex(3);

    ll.print(); //?
    expect(ll.print()).to.eq("10 -> 20 -> 30 -> null");
  });

  it("should remove the beginning", () => {
    ll.removeAtIndex(0);

    ll.print(); //?
    expect(ll.print()).to.eq("20 -> 30 -> 40 -> null");
  });
});
