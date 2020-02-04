import ShortDate from '../ShortDate';
import { date } from './helpers';

function createInvalidDate1() {
  return date(32, 4, 2018);
}

function createInvalidDate2() {
  return date(29, 2, 2019);
}

test('constructor', () => {
  expect(createInvalidDate1).toThrow();
  expect(createInvalidDate2).toThrow();
});

test('diff method', () => {
  const date1 = date(24, 3, 2020);
  const date2 = date(20, 3, 2020);
  expect(date1.diff(date2)).toStrictEqual(4);
});

test('max static method', () => {
  const max1 = ShortDate.max(
    date(1, 8, 2019),
    date(24, 3, 2017),
    date(22, 9, 2020),
    date(6, 10, 2020),
    date(26, 5, 2014)
  );
  expect(max1.equals(date(6, 10, 2020))).toStrictEqual(true);
  const max2 = ShortDate.max(
    date(22, 9, 2018),
    date(1, 8, 2016),
    date(24, 3, 2012),
    date(6, 5, 2018),
    date(22, 5, 2017)
  );
  expect(max2.equals(date(22, 9, 2018))).toStrictEqual(true);
  const max3 = ShortDate.max(date(22, 9, 2018));
  expect(max3.equals(date(22, 9, 2018))).toStrictEqual(true);
  const max4 = ShortDate.max(date(10, 5, 2013), date(6, 12, 2016));
  expect(max4.equals(date(6, 12, 2016))).toStrictEqual(true);
});
