import Comparable from './interfaces/Comparable';
import SLLQueue from './SLLQueue';

const RED = true;
const BLACK = !RED;

class Node<K, V> {
  key: K;
  vals: V[];
  left: Node<K, V>;
  right: Node<K, V>;
  color: boolean;
  size: number;
  valueCount: number;

  constructor(key: K, val: V, color: boolean, size: number) {
    this.key = key;
    this.vals = [val];
    this.left = null;
    this.right = null;
    this.color = color;
    this.size = size;
    this.valueCount = 1;
  }
}

/**
 * Similar to RedBlackBST but allows multiple values at each node.
 * It also supports reverse inorder traversal and (for now) does not
 * allow delete operations.
 */
export default class EnhancedRedBlackBST<K extends Comparable<K>, V> {
  private root: Node<K, V>;

  constructor() {
    this.root = null;
  }

  valueCount(): number {
    if (this.root === null) return 0;
    return this.root.valueCount;
  }

  size(): number {
    return this.nodeSize(this.root);
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  put(key: K, val: V) {
    if (key === null) throw new Error('first argument to put() is null');
    if (val === null) return;
    this.root = this.nodePut(this.root, key, val);
    this.root.color = BLACK;
  }

  private nodePut(h: Node<K, V>, key: K, val: V): Node<K, V> {
    if (h === null) return new Node(key, val, RED, 1);

    const cmp = key.compareTo(h.key);
    if (cmp < 0) h.left = this.nodePut(h.left, key, val);
    else if (cmp > 0) h.right = this.nodePut(h.right, key, val);
    else h.vals.push(val);

    if (this.isRed(h.right) && !this.isRed(h.left)) h = this.rotateLeft(h);
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);

    h.size = this.nodeSize(h.left) + this.nodeSize(h.right) + 1;
    h.valueCount++;

    return h;
  }

  private isRed(x: Node<K, V>): boolean {
    if (x === null) return false;
    return x.color === RED;
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

  private nodeSize(x: Node<K, V>): number {
    if (x === null) return 0;
    return x.size;
  }

  private flipColors(h: Node<K, V>): void {
    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
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
    if (t != null) return t;
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

  private nodeSelect(x: Node<K, V>, k: number): Node<K, V> {
    const t = this.nodeSize(x.left);
    if (t > k) return this.nodeSelect(x.left, k);
    if (t < k) return this.nodeSelect(x.right, k - t - 1);
    return x;
  }

  keys(): Iterable<K> {
    if (this.isEmpty()) return new SLLQueue<K>();
    return this.keysWithin(this.min(), this.max());
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

  vals(): V[] {
    if (this.isEmpty()) return [];
    return this.valsWithin(this.min(), this.max());
  }

  valsWithin(lo: K, hi: K): V[] {
    if (lo === null) throw new Error('first argument to keys() is null');
    if (hi === null) throw new Error('second argument to keys() is null');

    const vals: V[] = [];
    // if (isEmpty() || lo.compareTo(hi) > 0) return queue;
    this.nodeValsWithin(this.root, vals, lo, hi);
    return vals;
  }

  private nodeValsWithin(x: Node<K, V>, vals: V[], lo: K, hi: K): void {
    if (x === null) return;
    const cmplo = lo.compareTo(x.key);
    const cmphi = hi.compareTo(x.key);
    if (cmplo < 0) this.nodeValsWithin(x.left, vals, lo, hi);
    if (cmplo <= 0 && cmphi >= 0) {
      x.vals.forEach(val => {
        vals.push(val);
      });
    }
    if (cmphi > 0) this.nodeValsWithin(x.right, vals, lo, hi);
  }

  valsReverse(): V[] {
    if (this.isEmpty()) return [];
    return this.valsWithinReverse(this.min(), this.max());
  }

  valsWithinReverse(lo: K, hi: K): V[] {
    if (lo === null) throw new Error('first argument to keys() is null');
    if (hi === null) throw new Error('second argument to keys() is null');

    const vals: V[] = [];
    // if (isEmpty() || lo.compareTo(hi) > 0) return queue;
    this.nodeValsWithinReverse(this.root, vals, lo, hi);
    return vals;
  }

  private nodeValsWithinReverse(x: Node<K, V>, vals: V[], lo: K, hi: K): void {
    if (x === null) return;
    const cmplo = lo.compareTo(x.key);
    const cmphi = hi.compareTo(x.key);
    if (cmphi > 0) this.nodeValsWithinReverse(x.right, vals, lo, hi);
    if (cmplo <= 0 && cmphi >= 0)
      for (let i = x.vals.length - 1; i >= 0; i--) {
        vals.push(x.vals[i]);
      }
    if (cmplo < 0) this.nodeValsWithinReverse(x.left, vals, lo, hi);
  }

  sizeWithin(lo: K, hi: k): number {
    if (lo === null) throw new Error('first argument to size() is null');
    if (hi === null) throw new Error('second argument to size() is null');

    if (lo.compareTo(hi) > 0) return 0;
    if (this.contains(hi)) return this.rank(hi) - this.rank(lo) + 1;
    return this.rank(hi) - this.rank(lo);
  }

  contains(key: K): boolean {
    return this.get(key).length !== 0;
  }

  get(key: K): V[] {
    if (key === null) throw new Error('argument to get() is null');
    return this.nodeGet(this.root, key);
  }

  private nodeGet(x: Node<K, V>, key: K): V[] {
    while (x !== null) {
      const cmp = key.compareTo(x.key);
      if (cmp < 0) x = x.left;
      else if (cmp > 0) x = x.right;
      else return x.vals;
    }
    return [];
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
}
