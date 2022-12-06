// https://www.youtube.com/watch?v=paYFUrK1dys

/**
 * First In First Out (FIFO)
 * with time complexity of O(1) for key operations
 */
export class Queue<T> {
  private data: { [index: ]: T } = Object.create(null); // bigint is like string vs number
  private nextEnqueueIndex = 0n; // uses bigint to avoid overflow with Number.MAX_SAFE_INTEGER
  private nextDequeueIndex = 0n;

  //     dequeue ||||||||||| enqueue

  /** Enqueues the item in O(1), li,e array push but better */
  enqueue(item: T): void {
    // store the item in the nextEnqueueIndex, and increment nextEnqueueIndex
    this.data[this.nextEnqueueIndex.toString()] = item; // we use toString because we need the string representation of the value
    this.nextEnqueueIndex++;
  }

  /**
   * Dequeues the first inserted item in O(1), like array shift but better
   * If there are no more items it returns `undefined`
   */
  dequeue(): T | undefined {
    // if dequeue index caught up with enqueue index, return undefined
    if (this.nextDequeueIndex !== this.nextEnqueueIndex) {
      // store the item in the nextDequeueIndex, delete the item, increment nextDequeue, return the item
      const dequeued = this.data[this.nextDequeueIndex.toString()];
      delete this.data[this.nextDequeueIndex.toString()];
      this.nextDequeueIndex++;
      return dequeued;
    }
  }

  /**
   * Returns the number of elements in the queue
   */
  size(): bigint { // using bigint because this data structure can hold more than Number.MAX_SAFE_INTEGER
    return this.nextEnqueueIndex - this.nextDequeueIndex;
  }
}
