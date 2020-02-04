import Queue from './interfaces/Queue';

class Node<E> {
  next: Node<E>;
  data: E;

  constructor(data: E) {
    this.data = data;
    this.next = null;
  }
}

/**
 * Queue implemented with a singly-linked list. Items are
 * enqueued from top, dequeued from bottom.
 */
export default class SLLQueue<E> implements Queue<E> {
  private top: Node<E>;
  private bottom: Node<E>;
  private itemCount: number;

  constructor() {
    this.top = null;
    this.bottom = null;
    this.itemCount = 0;
  }

  enqueue(item: E) {
    const newNode = new Node<E>(item);
    if (this.isEmpty()) {
      this.top = newNode;
      this.bottom = newNode;
    } else {
      this.top.next = newNode;
      this.top = this.top.next;
    }
    this.itemCount++;
  }

  dequeue(): E {
    this.validateNonEmptyQueue();
    const bottomItem = this.bottom.data;
    this.bottom = this.bottom.next;
    this.itemCount--;
    return bottomItem;
  }

  peek(): E {
    this.validateNonEmptyQueue();
    return this.bottom.data;
  }

  private validateNonEmptyQueue(): void {
    if (this.itemCount === 0) throw new Error('The queue is empty.');
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  size(): number {
    return this.itemCount;
  }

  [Symbol.iterator]() {
    let cur = this.bottom;
    return {
      next: () => {
        const done = cur === null;
        let value: E;
        if (!done) {
          value = cur.data;
          cur = cur.next;
        }
        return { value, done };
      },
    };
  }
}
