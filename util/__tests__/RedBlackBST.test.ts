import Comparable from '../interfaces/Comparable';
import RedBlackBST from '../RedBlackBST';

class Integer implements Comparable<Integer> {
  val: number;

  constructor(val: number) {
    this.val = val;
  }

  equals(that: Integer): boolean {
    return this.compareTo(that) === 0;
  }

  compareTo(that: Integer): number {
    return this.val - that.val;
  }

  toString(): string {
    return `${this.val}`;
  }
}

const integer = (val: number) => new Integer(val);

test('stream', () => {
  const rbtree = new RedBlackBST<Integer, string>();
  let state = {};

  // Helpers
  const isEmpty = () => rbtree.isEmpty();
  const contains = (int: number) => rbtree.contains(integer(int));
  const size = () => rbtree.size();
  const put = (int: number, val: string) => rbtree.put(integer(int), val);
  const get = (int: number) => rbtree.get(integer(int));
  const ceiling = (int: number) => rbtree.ceiling(integer(int));
  const floor = (int: number) => rbtree.floor(integer(int));
  const min = () => rbtree.min();
  const max = () => rbtree.max();
  const select = (k: number) => rbtree.select(k);
  const rank = (int: number) => rbtree.rank(integer(int));
  const keys = () => rbtree.keys();
  const keysWithin = (lo: number, hi: number) =>
    rbtree.keysWithin(integer(lo), integer(hi));

  expectIsEmpty();

  put(5, 'five');
  expectIsNotEmpty();
  put(4, 'four');
  put(2, 'two');
  put(9, 'nine');
  expectContains(2);
  expectNotContains(8);
  put(5, 'five-2');
  expectContains(5);
  put(6, 'six');
  put(0, 'zero');
  put(1, 'one');
  put(-14, 'minus-fourteen');
  put(-11, 'minus-eleven');
  put(7, 'seven');
  put(5, 'five-3');
  put(6, 'six-2');

  state = {
    '-14': 'minus-fourteen',
    '-11': 'minus-eleven',
    0: 'zero',
    1: 'one',
    2: 'two',
    4: 'four',
    5: 'five-3',
    6: 'six-2',
    7: 'seven',
    9: 'nine',
  };

  expectIsNotEmpty();
  expectSize().toBe(10);
  expectMin().toBe(-14);
  expectMax().toBe(9);

  expectGet(5).toBe('five-3');
  expectGet(-11).toBe(state[-11]);
  expectGet(6).toBe(state[6]);
  expectGet(2).toBe(state[2]);

  // deleteMin
  expectConsistentDeleteMin(-14);
  expectConsistentDeleteMin(-11);
  expectConsistentDeleteMin(0);
  expectSize().toBe(7);

  // deleteMax
  expectConsistentDeleteMax(9);
  expectConsistentDeleteMax(7);
  expectConsistentDeleteMax(6);

  state = {
    1: 'one',
    2: 'two',
    4: 'four',
    5: 'five-3',
  };
  expectSize().toBe(4);
  expectMin().toBe(1);
  expectMax().toBe(5);

  put(2, 'two-2');
  put(-4, 'minus-four');
  put(-20, 'minus-twenty');
  put(14, 'fourteen');

  state = {
    '-20': 'minus-twenty',
    '-4': 'minus-4',
    1: 'one',
    2: 'two-2',
    4: 'four',
    5: 'five-3',
    14: 'fourteen',
  };

  expectSize().toBe(7);
  expectMin().toBe(-20);
  expectMax().toBe(14);

  expectGet(5).toBe(state[5]);
  expectGet(14).toBe(state[14]);

  // Keys
  expectKeys().toBeLike([-20, -4, 1, 2, 4, 5, 14]);
  expectKeysWithin(-45, 0).toBeLike([-20, -4]);
  expectKeysWithin(-20, 1).toBeLike([-20, -4, 1]);
  expectKeysWithin(-5, 3).toBeLike([-4, 1, 2]);
  expectKeysWithin(-3, 4).toBeLike([1, 2, 4]);
  expectKeysWithin(2, 100).toBeLike([2, 4, 5, 14]);

  // Rank
  expectRankOf(-100).toBe(0);
  expectRankOf(-20).toBe(0);
  expectRankOf(-19).toBe(1);
  expectRankOf(-2).toBe(2);
  expectRankOf(2).toBe(3);
  expectRankOf(14).toBe(6);
  expectRankOf(100).toBe(7);

  // Select
  expectSelect(0).toBe(-20);
  expectSelect(1).toBe(-4);
  expectSelect(2).toBe(1);
  // ...
  expectSelect(5).toBe(5);
  expectSelect(6).toBe(14);

  // Ceiling
  expectCeilingOf(-100).toBe(-20);
  expectCeilingOf(-20).toBe(-20);
  expectCeilingOf(-19).toBe(-4);
  expectCeilingOf(-1).toBe(1);
  expectCeilingOf(0).toBe(1);
  expectCeilingOf(1).toBe(1);
  expectCeilingOf(2).toBe(2);
  expectCeilingOf(3).toBe(4);
  expectCeilingOf(4).toBe(4);
  expectCeilingOf(14).toBe(14);
  expectCeilingOf(100).toBe(null);

  // Floor
  expectFloorOf(-100).toBe(null);
  expectFloorOf(-20).toBe(-20);
  expectFloorOf(-19).toBe(-20);
  expectFloorOf(-1).toBe(-4);
  expectFloorOf(0).toBe(-4);
  expectFloorOf(1).toBe(1);
  expectFloorOf(2).toBe(2);
  expectFloorOf(3).toBe(2);
  expectFloorOf(4).toBe(4);
  expectFloorOf(14).toBe(14);
  expectFloorOf(15).toBe(14);
  expectFloorOf(100).toBe(14);

  function expectConsistentDeleteMin(expectedMin: number) {
    expectContains(expectedMin);
    rbtree.deleteMin();
    expectNotContains(expectedMin);
  }

  function expectConsistentDeleteMax(expectedMax: number) {
    expectContains(expectedMax);
    rbtree.deleteMax();
    expectNotContains(expectedMax);
  }

  function expectIsEmpty() {
    return expect(isEmpty()).toBe(true);
  }

  function expectIsNotEmpty() {
    return expect(isEmpty()).toBe(false);
  }

  function expectContains(int: number) {
    return expect(contains(int)).toBe(true);
  }

  function expectNotContains(int: number) {
    return expect(contains(int)).toBe(false);
  }

  function expectSize() {
    return expect(size());
  }

  function expectGet(int: number) {
    return expect(get(int));
  }

  function expectCeilingOf(int: number) {
    return {
      toBe: (c: number | null) => {
        const ceil = ceiling(int);
        if (c === null) return expect(ceil).toBe(null);
        return expect(ceiling(int).compareTo(integer(c))).toBe(0);
      },
    };
  }

  function expectFloorOf(int: number) {
    return {
      toBe: (c: number | null) => {
        const ceil = floor(int);
        if (c === null) return expect(ceil).toBe(null);
        return expect(floor(int).compareTo(integer(c))).toBe(0);
      },
    };
  }

  function expectMin() {
    return {
      toBe: (c: number) => {
        return expect(min().compareTo(integer(c))).toBe(0);
      },
    };
  }

  function expectMax() {
    return {
      toBe: (c: number) => {
        return expect(max().compareTo(integer(c))).toBe(0);
      },
    };
  }

  function expectSelect(k: number) {
    return {
      toBe: (c: number) => {
        return expect(select(k).equals(integer(c))).toBe(true);
      },
    };
  }

  function expectRankOf(key: number) {
    return expect(rank(key));
  }

  function expectKeys() {
    return expectIterable(keys());
  }

  function expectKeysWithin(lo: number, hi: number) {
    return expectIterable(keysWithin(lo, hi));
  }

  function expectIterable(iterable: Iterable<Integer>) {
    return {
      toBeLike: (keysExpected: number[]) => {
        let idx = 0;
        for (const key of iterable) {
          expect(key.equals(integer(keysExpected[idx++]))).toBe(true);
        }
      },
    };
  }
});
