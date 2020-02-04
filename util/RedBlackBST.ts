import Comparable from './interfaces/Comparable';
import SLLQueue from './SLLQueue';

const RED = true;
const BLACK = !RED;

class Node<K, V> {
  key: K;
  val: V;
  left: Node<K, V>;
  right: Node<K, V>;
  color: boolean;
  size: number;

  constructor(key: K, val: V, color: boolean, size: number) {
    this.key = key;
    this.val = val;
    this.left = null;
    this.right = null;
    this.color = color;
    this.size = size;
  }
}

/**
 * A slightly modified version of Prof. Sedgewick's RedBlackBST.java.
 * @see https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html
 */
export default class RedBlackBST<K extends Comparable<K>, V> {
  private root: Node<K, V>;

  constructor() {
    this.root = null;
  }

  put(key: K, val: V) {
    if (key === null) throw new Error('first argument to put() is null');
    if (val === null) {
      this.delete(key);
      return;
    }
    this.root = this.nodePut(this.root, key, val);
    this.root.color = BLACK;
  }

  private nodePut(h: Node<K, V>, key: K, val: V): Node<K, V> {
    if (h === null) return new Node(key, val, RED, 1);

    const cmp = key.compareTo(h.key);
    if (cmp < 0) h.left = this.nodePut(h.left, key, val);
    else if (cmp > 0) h.right = this.nodePut(h.right, key, val);
    else h.val = val;

    if (this.isRed(h.right) && !this.isRed(h.left)) h = this.rotateLeft(h);
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);
    h.size = this.nodeSize(h.left) + this.nodeSize(h.right) + 1;

    return h;
  }

  deleteMin(): void {
    if (this.isEmpty()) throw new Error('BST underflow');

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right))
      this.root.color = RED;

    this.root = this.nodeDeleteMin(this.root);
    if (!this.isEmpty()) this.root.color = BLACK;
  }

  private nodeDeleteMin(h: Node<K, V>): Node<K, V> {
    if (h.left === null) return null;

    if (!this.isRed(h.left) && !this.isRed(h.left.left))
      h = this.moveRedLeft(h);

    h.left = this.nodeDeleteMin(h.left);
    return this.balance(h);
  }

  deleteMax(): void {
    if (this.isEmpty()) throw new Error('BST underflow');

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right))
      this.root.color = RED;

    this.root = this.nodeDeleteMax(this.root);
    if (!this.isEmpty()) this.root.color = BLACK;
  }

  private nodeDeleteMax(h: Node<K, V>): Node<K, V> {
    if (this.isRed(h.left)) h = this.rotateRight(h);

    if (h.right === null) return null;

    if (!this.isRed(h.right) && !this.isRed(h.right.left))
      h = this.moveRedRight(h);

    h.right = this.nodeDeleteMax(h.right);

    return this.balance(h);
  }

  delete(key: K): void {
    if (key === null) throw new Error('argument to delete() is null');
    if (!this.contains(key)) return;

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right))
      this.root.color = RED;

    this.root = this.nodeDelete(this.root, key);
    if (!this.isEmpty()) this.root.color = BLACK;
  }

  private nodeDelete(h: Node<K, V>, key: K): Node<K, V> {
    if (key.compareTo(h.key) < 0) {
      if (!this.isRed(h.left) && !this.isRed(h.left.left))
        h = this.moveRedLeft(h);
      h.left = this.nodeDelete(h.left, key);
    } else {
      if (this.isRed(h.left)) h = this.rotateRight(h);
      if (key.compareTo(h.key) === 0 && h.right === null) return null;
      if (!this.isRed(h.right) && !this.isRed(h.right.left))
        h = this.moveRedRight(h);
      if (key.compareTo(h.key) === 0) {
        const x = this.min(h.right);
        h.key = x.key;
        h.val = x.val;
        // h.val = this.nodeGet(h.right, min(h.right).key);
        // h.key = this.nodeMin(h.right).key;
        h.right = this.nodeDeleteMin(h.right);
      } else h.right = delete (h.right, key);
    }
    return this.balance(h);
  }

  private rotateRight(h: Node<K, V>): Node<K, V> {
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = x.right.color;
    x.right.color = RED;
    x.size = h.size;
    h.size = this.nodeSize(h.left) + this.nodeSize(h.right) + 1;
    return x;
  }

  private rotateLeft(h: Node<K, V>): Node<K, V> {
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = x.left.color;
    x.left.color = RED;
    x.size = h.size;
    h.size = this.nodeSize(h.left) + this.nodeSize(h.right) + 1;
    return x;
  }

  private flipColors(h: Node<K, V>): void {
    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
  }

  private moveRedLeft(h: Node<K, V>) {
    this.flipColors(h);
    if (this.isRed(h.right.left)) {
      h.right = this.rotateRight(h.right);
      h = this.rotateLeft(h);
      this.flipColors(h);
    }
    return h;
  }
  private moveRedRight(h: Node<K, V>): Node<K, V> {
    this.flipColors(h);
    if (this.isRed(h.left.left)) {
      h = this.rotateRight(h);
      this.flipColors(h);
    }
    return h;
  }

  private balance(h: Node<K, V>): Node<K, V> {
    if (this.isRed(h.right)) h = this.rotateLeft(h);
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);

    h.size = this.nodeSize(h.left) + this.nodeSize(h.right) + 1;
    return h;
  }

  private isRed(x: Node<K, V>) {
    if (x === null) return false;
    return x.color === RED;
  }

  height(): number {
    return this.nodeHeight(this.root);
  }

  private nodeHeight(x: Node<K, V>): number {
    if (x === null) return -1;
    return 1 + Math.max(this.nodeHeight(x.left), this.nodeHeight(x.right));
  }

  min(): K {
    if (this.isEmpty()) throw new Error('calls min() with empty symbol table');
    return this.nodeMin(this.root).key;
  }

  private nodeMin(x: Node<K, V>): Node<K, V> {
    if (x.left === null) return x;
    return this.nodeMin(x.left);
  }

  max(): K {
    if (this.isEmpty()) throw new Error('calls max() with empty symbol table');
    return this.nodeMax(this.root).key;
  }

  private nodeMax(x: Node<K, V>): Node<K, V> {
    if (x.right === null) return x;
    return this.nodeMax(x.right);
  }

  floor(key: K): K {
    if (key === null) throw new Error('argument to floor() is null');
    if (this.isEmpty())
      throw new Error('calls floor() with empty symbol table');
    const x = this.nodeFloor(this.root, key);
    if (x === null) return null; // key is too small
    return x.key;
  }

  private nodeFloor(x: Node<K, V>, key: K): Node<K, V> {
    if (x === null) return null;
    const cmp = key.compareTo(x.key);
    if (cmp === 0) return x;
    if (cmp < 0) return this.nodeFloor(x.left, key);
    const t = this.nodeFloor(x.right, key);
    if (t !== null) return t;
    return x;
  }

  ceiling(key: K): K {
    if (key === null) throw new Error('argument to ceiling() is null');
    if (this.isEmpty())
      throw new Error('calls ceiling() with empty symbol table');
    const x = this.nodeCeiling(this.root, key);
    if (x === null) return null; // key is too large
    return x.key;
  }

  private nodeCeiling(x: Node<K, V>, key: K): Node<K, V> {
    if (x === null) return null;
    const cmp = key.compareTo(x.key);
    if (cmp === 0) return x;
    if (cmp > 0) return this.nodeCeiling(x.right, key);
    const t = this.nodeCeiling(x.left, key);
    if (t !== null) return t;
    return x;
  }

  select(k: number): K {
    if (k < 0 || k >= this.size()) {
      throw new Error(`argument to select() is invalid: ${k}`);
    }
    const x = this.nodeSelect(this.root, k);
    return x.key;
  }

  size(): number {
    return this.nodeSize(this.root);
  }

  private nodeSelect(x: Node<K, V>, k: number): Node<K, V> {
    const t = this.nodeSize(x.left);
    if (t > k) return this.nodeSelect(x.left, k);
    if (t < k) return this.nodeSelect(x.right, k - t - 1);
    return x;
  }

  rank(key: K): number {
    if (key === null) throw new Error('argument to rank() is null');
    return this.nodeRank(key, this.root);
  }

  private nodeRank(key: K, x: Node<K, V>): number {
    if (x === null) return 0;
    const cmp = key.compareTo(x.key);
    if (cmp < 0) return this.nodeRank(key, x.left);
    if (cmp > 0) return 1 + this.nodeSize(x.left) + this.nodeRank(key, x.right);
    return this.nodeSize(x.left);
  }

  private nodeSize(x: Node<K, V>): number {
    if (x === null) return 0;
    return x.size;
  }

  keys(): Iterable<K> {
    if (this.isEmpty()) return new SLLQueue<K>();
    return this.keysWithin(this.min(), this.max());
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  keysWithin(lo: K, hi: K): Iterable<K> {
    if (lo === null) throw new Error('first argument to keys() is null');
    if (hi === null) throw new Error('second argument to keys() is null');

    const queue = new SLLQueue<K>();
    // if (isEmpty() || lo.compareTo(hi) > 0) return queue;
    this.nodeKeysWithin(this.root, queue, lo, hi);
    return queue;
  }

  private nodeKeysWithin(
    x: Node<K, V>,
    queue: SLLQueue<K>,
    lo: K,
    hi: K
  ): void {
    if (x === null) return;
    const cmplo = lo.compareTo(x.key);
    const cmphi = hi.compareTo(x.key);
    if (cmplo < 0) this.nodeKeysWithin(x.left, queue, lo, hi);
    if (cmplo <= 0 && cmphi >= 0) queue.enqueue(x.key);
    if (cmphi > 0) this.nodeKeysWithin(x.right, queue, lo, hi);
  }

  sizeWithin(lo: K, hi: k): number {
    if (lo === null) throw new Error('first argument to size() is null');
    if (hi === null) throw new Error('second argument to size() is null');

    if (lo.compareTo(hi) > 0) return 0;
    if (this.contains(hi)) return this.rank(hi) - this.rank(lo) + 1;
    return this.rank(hi) - this.rank(lo);
  }

  contains(key: K): boolean {
    return this.get(key) !== null;
  }

  get(key: K): V {
    if (key === null) throw new Error('argument to get() is null');
    return this.nodeGet(this.root, key);
  }

  private nodeGet(x: Node<K, V>, key: K): V {
    while (x !== null) {
      const cmp = key.compareTo(x.key);
      if (cmp < 0) x = x.left;
      else if (cmp > 0) x = x.right;
      else return x.val;
    }
    return null;
  }
}
