import Period from '../Period';
import ShortDate from '../ShortDate';
import { period, date } from './helpers';

test('constructor method', () => {
  const P = period([4, 3, 2017], [8, 1, 2019]);

  expectNotContains(P, date(18, 8, 2016));

  expectNotContains(P, date(2, 3, 2017));
  expectNotContains(P, date(3, 3, 2017));
  expectContains(P, date(4, 3, 2017));
  expectContains(P, date(5, 3, 2017));
  expectContains(P, date(6, 3, 2017));

  expectContains(P, date(28, 9, 2018));

  expectContains(P, date(6, 1, 2019));
  expectContains(P, date(7, 1, 2019));
  expectContains(P, date(8, 1, 2019));
  expectNotContains(P, date(9, 1, 2019));
  expectNotContains(P, date(10, 1, 2019));

  expectNotContains(P, date(14, 4, 2020));
});

function expectContains(P: Period, d: ShortDate) {
  expect(P.contains(d)).toStrictEqual(true);
}

function expectNotContains(P: Period, d: ShortDate) {
  expect(P.contains(d)).toStrictEqual(false);
}

test('intersects method', () => {
  expectIntersectsBidirectionally(
    period([2, 4, 2013], [4, 9, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  );
  expectIntersectsBidirectionally(
    period([6, 8, 2014], [2, 2, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  );
  expectIntersectsBidirectionally(
    period([6, 8, 2014], [2, 2, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  );
  expectIntersectsBidirectionally(
    period([2, 6, 2005], [4, 9, 2008]),
    period([19, 5, 2001], [15, 2, 2010])
  );
  expectNotIntersectsBidirectionally(
    period([6, 8, 2014], [1, 2, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  );
  expectNotIntersectsBidirectionally(
    period([13, 9, 2014], [1, 2, 2015]),
    period([1, 2, 2018], [9, 11, 2019])
  );
  expectNotIntersectsBidirectionally(
    period([2, 2, 2015], [3, 2, 2015]),
    period([4, 2, 2015], [5, 2, 2015])
  );
});

function expectIntersectsBidirectionally(I1: Period, I2: Period) {
  expectIntersects(I1, I2);
  expectIntersects(I2, I1);
}

function expectNotIntersectsBidirectionally(I1: Period, I2: Period) {
  expectNotIntersects(I1, I2);
  expectNotIntersects(I2, I1);
}

function expectIntersects(I1: Period, I2: Period) {
  expect(I1.intersects(I2)).toStrictEqual(true);
}

function expectNotIntersects(I1: Period, I2: Period) {
  expect(I1.intersects(I2)).toStrictEqual(false);
}

test('intersection method', () => {
  expectIntersectionOf(
    period([2, 4, 2013], [4, 9, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  ).toBe(period([2, 2, 2015], [4, 9, 2015]));

  expectIntersectionOf(
    period([6, 8, 2014], [2, 2, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  ).toBe(period([2, 2, 2015], [2, 2, 2015]));

  expectIntersectionOf(
    period([6, 8, 2014], [2, 2, 2017]),
    period([2, 2, 2009], [9, 11, 2015])
  ).toBe(period([6, 8, 2014], [9, 11, 2015]));

  expectIntersectsBidirectionally(
    period([2, 6, 2005], [4, 9, 2008]),
    period([19, 5, 2001], [15, 2, 2010])
  );

  expectIntersectionOf(
    period([2, 6, 2005], [4, 9, 2008]),
    period([19, 5, 2001], [15, 2, 2010])
  ).toBe(period([2, 6, 2005], [4, 9, 2008]));

  expectIntersectionOf(
    period([6, 8, 2009], [2, 2, 2012]),
    period([2, 2, 2007], [6, 8, 2009])
  ).toBe(period([6, 8, 2009], [6, 8, 2009]));

  expectIntersectionOf(
    period([6, 8, 2014], [1, 2, 2015]),
    period([2, 2, 2015], [9, 11, 2019])
  ).toBe(null);

  expectIntersectionOf(
    period([13, 9, 2014], [1, 2, 2015]),
    period([1, 2, 2018], [9, 11, 2019])
  ).toBe(null);

  expectIntersectionOf(
    period([2, 2, 2015], [3, 2, 2015]),
    period([4, 2, 2015], [5, 2, 2015])
  ).toBe(null);
});

function expectIntersectionOf(P1: Period, P2: Period) {
  const intersection = P1.intersection(P2);
  return {
    toBe: (IP: Period | null) => {
      if (IP === null) expect(intersection).toStrictEqual(null);
      else {
        expect(intersection).not.toBe(null);
        expect(intersection.equals(IP)).toBe(true);
      }
    },
  };
}
