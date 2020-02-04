import City from '../City';
import Period from '../Period';
import Residency from '../Residency';
import ShortDate from '../ShortDate';
import Travel from '../Travel';

type DateArray = [number, number, number];

export const period = (
  [fromD, fromM, fromY]: DateArray,
  [toD, toM, toY]: DateArray
) => new Period(date(fromD, fromM, fromY), date(toD, toM, toY));

export const residency = (
  id: string,
  cityCode: string,
  fromDateString: string,
  toDateString: string | null
) => Residency.createWithRawParams(id, cityCode, fromDateString, toDateString);

export const date = (...[d, m, y]: DateArray) => new ShortDate(d, m, y);

export const city = (code: string) => new City(code);

export const travel = (...args) => new Travel(...args);
