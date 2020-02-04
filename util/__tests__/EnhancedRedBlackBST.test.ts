import Comparable from '../interfaces/Comparable';
import EnhancedRedBlackBST from '../EnhancedRedBlackBST';

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

test('integrity of RB tree data structure', () => {
  const rbtree = new EnhancedRedBlackBST<Integer, string>();
  let state: { [key: number]: string[] } = {};

  // Helpers
  const isEmpty = () => rbtree.isEmpty();
  const contains = (int: number) => rbtree.contains(integer(int));
  const size = () => rbtree.size();
  const valueCount = () => rbtree.valueCount();
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
  const vals = () => rbtree.vals();
  const valsWithin = (lo: number, hi: number) =>
    rbtree.valsWithin(integer(lo), integer(hi));

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
    '-14': ['minus-fourteen'],
    '-11': ['minus-eleven'],
    0: ['zero'],
    1: ['one'],
    2: ['two'],
    4: ['four'],
    5: ['five', 'five-2', 'five-3'],
    6: ['six', 'six-2'],
    7: ['seven'],
    9: ['nine'],
  };

  expectIsNotEmpty();
  expectSize().toBe(10);
  expectValueCount().toBe(13);
  expectMin().toBe(-14);
  expectMax().toBe(9);

  testConsistencyWithState();

  put(2, 'two-2');
  put(-4, 'minus-four');
  put(-20, 'minus-twenty');
  put(14, 'fourteen');
  put(6, 'six-3');
  put(7, 'seven-2');
  put(61, 'sixty-one');
  put(0, 'zero-2');

  state = {
    '-20': ['minus-twenty'],
    '-14': ['minus-fourteen'],
    '-11': ['minus-eleven'],
    '-4': ['minus-four'],
    0: ['zero', 'zero-2'],
    1: ['one'],
    2: ['two', 'two-2'],
    4: ['four'],
    5: ['five', 'five-2', 'five-3'],
    6: ['six', 'six-2', 'six-3'],
    7: ['seven', 'seven-2'],
    9: ['nine'],
    14: ['fourteen'],
    61: ['sixty-one'],
  };

  expectSize().toBe(14);
  expectValueCount().toBe(21);

  expectMin().toBe(-20);
  expectMax().toBe(61);

  testConsistencyWithState();

  testConsistencyOfKeysWithState();
  expectKeysWithin(-45, 0).toBeLike([-20, -14, -11, -4, 0]);
  expectKeysWithin(-20, 1).toBeLike([-20, -14, -11, -4, 0, 1]);
  expectKeysWithin(-5, 3).toBeLike([-4, 0, 1, 2]);
  expectKeysWithin(-3, 4).toBeLike([0, 1, 2, 4]);
  expectKeysWithin(2, 100).toBeLike([2, 4, 5, 6, 7, 9, 14, 61]);

  testConsistencyOfValsWithState();
  expectValsWithin(-45, -5).toBeLike([
    'minus-twenty',
    'minus-fourteen',
    'minus-eleven',
  ]);
  expectValsWithin(-11, 2).toBeLike([
    'minus-eleven',
    'minus-four',
    'zero',
    'zero-2',
    'one',
    'two',
    'two-2',
  ]);
  expectValsWithin(6, 14).toBeLike([
    'six',
    'six-2',
    'six-3',
    'seven',
    'seven-2',
    'nine',
    'fourteen',
  ]);
  expectValsWithin(9, 100).toBeLike(['nine', 'fourteen', 'sixty-one']);
  expectValsWithin(61, 61).toBeLike(['sixty-one']);
  expectValsWithin(76, 100).toBeLike([]);

  // Rank
  expectRankOf(-100).toBe(0);
  expectRankOf(-20).toBe(0);
  expectRankOf(-19).toBe(1);
  expectRankOf(-10).toBe(3);
  expectRankOf(-2).toBe(4);
  expectRankOf(2).toBe(6);
  expectRankOf(14).toBe(12);
  expectRankOf(100).toBe(14);

  // Select
  expectSelect(0).toBe(-20);
  expectSelect(1).toBe(-14);
  expectSelect(2).toBe(-11);
  // ...
  expectSelect(5).toBe(1);
  expectSelect(6).toBe(2);

  // Ceiling
  expectCeilingOf(-100).toBe(-20);
  expectCeilingOf(-20).toBe(-20);
  expectCeilingOf(-19).toBe(-14);
  expectCeilingOf(-1).toBe(0);
  expectCeilingOf(0).toBe(0);
  expectCeilingOf(1).toBe(1);
  expectCeilingOf(2).toBe(2);
  expectCeilingOf(3).toBe(4);
  expectCeilingOf(4).toBe(4);
  expectCeilingOf(12).toBe(14);
  expectCeilingOf(100).toBe(null);

  // Floor
  expectFloorOf(-100).toBe(null);
  expectFloorOf(-20).toBe(-20);
  expectFloorOf(-19).toBe(-20);
  expectFloorOf(-1).toBe(-4);
  expectFloorOf(0).toBe(0);
  expectFloorOf(1).toBe(1);
  expectFloorOf(2).toBe(2);
  expectFloorOf(3).toBe(2);
  expectFloorOf(4).toBe(4);
  expectFloorOf(14).toBe(14);
  expectFloorOf(15).toBe(14);
  expectFloorOf(100).toBe(61);

  function testConsistencyOfKeysWithState() {
    return expectKeys().toBeLike(
      Object.keys(state)
        .map(k => Number(k))
        .sort((a, b) => a - b)
    );
  }

  function testConsistencyOfValsWithState() {
    const sortedStateKeys = Object.keys(state)
      .map(k => Number(k))
      .sort((a, b) => a - b);
    const res = vals();
    let i = 0;
    sortedStateKeys.forEach(key => {
      state[key].forEach(val => {
        expect(val === res[i++]).toBe(true);
      });
    });
  }

  function testConsistencyWithState() {
    Object.keys(state).forEach(key => {
      expectGet(Number(key)).toBeLike(state[key]);
    });
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

  function expectValueCount() {
    return expect(valueCount());
  }

  function expectGet(int: number) {
    const arr = get(int);
    return {
      toBeLike: (values: string[]) => {
        let idx = 0;
        for (const val of values) {
          expect(val === arr[idx++]).toBe(true);
        }
      },
    };
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

  function expectValsWithin(lo: number, hi: number) {
    return expectArray(valsWithin(lo, hi));
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

  function expectArray(arr: string[]) {
    return {
      toBeLike: (values: string[]) => {
        arr.forEach((item, idx) => {
          expect(item === values[idx]).toBe(true);
        });
      },
    };
  }
});
