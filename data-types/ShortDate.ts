import Comparable from '../util/interfaces/Comparable';

const MONTHS = [
  ['January', 'Jan', 31],
  ['February', 'Feb', 28],
  ['March', 'Mar', 31],
  ['April', 'Apr', 30],
  ['May', 'May', 31],
  ['June', 'Jun', 30],
  ['July', 'Jul', 31],
  ['August', 'Aug', 31],
  ['September', 'Sep', 30],
  ['October', 'Oct', 31],
  ['November', 'Nov', 30],
  ['December', 'Dec', 31],
];

/**
 * An immutable data type that loosely describes a date with the associated day,
 * month and year and provides a few useful operations on it.
 */
export default class ShortDate implements Comparable<ShortDate> {
  private day: number;
  private month: number;
  private year: number;

  /** @param {string} dateString - String representation in YYYY-MM-DD format. */
  static createWithYMDString(dateString: string): ShortDate {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(5, 7), 10);
    const day = parseInt(dateString.substring(8, 10), 10);
    return new ShortDate(day, month, year);
  }

  static createCurrent(): ShortDate {
    return ShortDate.convertFromJSDate(new Date());
  }

  static max(...dates: ShortDate[]) {
    if (dates.length === 0) {
      throw new Error('You must pass at least one parameter.');
    } else if (dates.length === 1) {
      return dates[0];
    }
    const zero = new ShortDate(1, 1, 0);
    let max = 0;
    let maxDiff = dates[0].diff(zero);
    for (let i = 1; i < dates.length; i++) {
      const distToZero = dates[i].diff(zero);
      if (distToZero > maxDiff) {
        maxDiff = distToZero;
        max = i;
      }
    }
    return dates[max];
  }

  static min(...dates: ShortDate[]) {
    if (dates.length === 0) {
      throw new Error('You must pass at least one parameter.');
    } else if (dates.length === 1) {
      return dates[0];
    }
    const zero = new ShortDate(1, 1, 0);
    let min = 0;
    let minDiff = dates[0].diff(zero);
    for (let i = 1; i < dates.length; i++) {
      const distToZero = dates[i].diff(zero);
      if (distToZero < minDiff) {
        minDiff = distToZero;
        min = i;
      }
    }
    return dates[min];
  }

  /**
   * Creates a ShortDate object.
   * @constructor
   */
  constructor(day: number, month: number, year: number) {
    ShortDate.validate(day, month, year);
    this.day = day;
    this.month = month;
    this.year = year;
    Object.freeze(this);
  }

  private static shortMonthName(month: number): string {
    return MONTHS[month - 1][1];
  }

  private static longMonthName(month: number): string {
    return MONTHS[month - 1][0];
  }

  /**
   * Checks whether the (day, month, year) combination represents a valid date.
   * Throws an error if it doesn't.
   * @throws Error if the combination does not represent a valid date.
   */
  private static validate(day: number, month: number, year: number): void {
    if (!Number.isSafeInteger(day) || day < 1 || day > 31)
      throw new Error('Day must be a safe integer between 1 and 31.');
    if (!Number.isSafeInteger(month) || month < 1 || month > 12)
      throw new Error('Month must be a safe integer between 1 and 12.');
    if (!Number.isSafeInteger(year))
      throw new Error('Year must be a safe integer.');
    if (day > ShortDate.dayCount(month, year))
      throw new Error(
        'The (day, month, year) combination does not represent a valid date.'
      );
  }

  /**
   * @return {number} The number of days that a specified month contains in a specified year.
   * Assumes month and year are valid.
   */
  private static dayCount(month: number, year: number): number {
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return ShortDate.isLeapYear(year) ? 29 : 28;
    }
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /** @returns {number} The day-of-the-month. */
  getDay(): number {
    return this.day;
  }

  /** @returns {number} The month index (between 1 and 12). */
  getMonth(): number {
    return this.month;
  }

  getYear(): number {
    return this.year;
  }

  equals(that: ShortDate): boolean {
    return this.compareTo(that) === 0;
  }

  asDayAndLongMonthAndYear(): string {
    return `${this.day} ${ShortDate.longMonthName(this.month)} ${this.year}`;
  }

  asDayAndShortMonthAndYear(): string {
    return `${this.day} ${ShortDate.shortMonthName(this.month)} ${this.year}`;
  }

  asLongMonthAndYear(): string {
    return `${ShortDate.longMonthName(this.month)} ${this.year}`;
  }

  asShortMonthAndYear(): string {
    return `${ShortDate.shortMonthName(this.month)} ${this.year}`;
  }

  asDayAndLongMonth(): string {
    return `${this.day} ${ShortDate.longMonthName(this.month)}`;
  }

  asDayAndShortMonth(): string {
    return `${this.day} ${ShortDate.shortMonthName(this.month)}`;
  }

  toString(): string {
    return this.asDayAndShortMonthAndYear();
  }

  isAfter(that: ShortDate): boolean {
    return this.compareTo(that) > 0;
  }

  isAfterOrEqualTo(that: ShortDate): boolean {
    return this.compareTo(that) >= 0;
  }

  isBefore(that: ShortDate): boolean {
    return this.compareTo(that) < 0;
  }

  isBeforeOrEqualTo(that: ShortDate): boolean {
    return this.compareTo(that) <= 0;
  }

  /**
   * Returns the distance between this date and a specified one, in number of days.
   * @example
   * // returns 5
   * new ShortDate(20, 4, 2019).diff(new ShortDate(15, 4, 2019));
   * @returns {number} A positive integer if this date is greater (later) than `that`, 0 if it is the
   * same date and a negative integer otherwise.
   */
  diff(that: ShortDate): number {
    return ShortDate.distToZero(this) - ShortDate.distToZero(that);
  }

  /** @returns {number} The number of days between the date specified and 1 January 0. */
  private static distToZero(date: ShortDate): number {
    const d = date.getDay();
    const m = date.getMonth();
    const y = date.getYear();
    let sum =
      y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
    for (let i = 1; i < m; i += 1) {
      const [, , dayCount] = MONTHS[i - 1];
      sum += dayCount;
    }
    return sum + d - 1;
  }

  /** @returns {Date} A JS Date object equivalent to the current ShortDate object. */
  getJSDate(): Date {
    return new Date(this.year, this.month - 1, this.day);
  }

  /** @returns {string} The string representation in YYYY-MM-DD format. */
  getYMDString(): string {
    return `${this.year}-${this.month > 9 ? this.month : `0${this.month}`}-${
      this.day
    }`;
  }

  /** @returns The delta-adjacent ShortDate object. */
  getAdjacentDate(delta: number): ShortDate {
    const cur = this.getJSDate();
    cur.setDate(cur.getDate() + delta);
    return ShortDate.convertFromJSDate(cur);
  }

  /** @returns {ShortDate} A new ShortDate object from a specified JS Date object. */
  static convertFromJSDate(jsDate: Date): ShortDate {
    const day = jsDate.getDate();
    const month = jsDate.getMonth() + 1;
    const year = jsDate.getFullYear();
    return new ShortDate(day, month, year);
  }

  compareTo(that: ShortDate) {
    if (this.year !== that.year) return this.year < that.year ? -1 : 1;
    if (this.month !== that.month) return this.month < that.month ? -1 : 1;
    if (this.day !== that.day) return this.day < that.day ? -1 : 1;
    return 0;
  }
}
