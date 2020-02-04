import Comparable from '../util/interfaces/Comparable';
import ShortDate from './ShortDate';

/** A data type that describes a date interval. */
export default class Period implements Comparable<Period> {
  private fromDate: ShortDate;
  private toDate: ShortDate;
  private length: number;

  constructor(fromDate: ShortDate, toDate: ShortDate) {
    if (!fromDate.isBeforeOrEqualTo(toDate))
      throw new Error(
        'fromDate must be chronologically before or equal to toDate'
      );
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.length = toDate.diff(fromDate);
    Object.freeze(this);
  }

  getFrom(): ShortDate {
    return this.fromDate;
  }

  getTo(): ShortDate {
    return this.toDate;
  }

  /**
   * The minimum number of days that two periods may intersect at is 1.
   * @example
   * const P1 = new Period(new ShortDate(20, 5, 2002), new ShortDate(13, 9, 2007))
   * const P2 = new Period(new ShortDate(13, 9, 2007), new ShortDate(2, 6, 2013))
   * const IP = new Period(new ShortDate(13, 9, 2007), new ShortDate(13, 9, 2007))
   *
   * // evaluates to true
   * P1.intersection(P2).equals(IP)
   *
   * @returns {Period} The the period of intersection, if the periods do intersect and null otherwise.
   */
  intersection(that: Period): Period | null {
    if (!this.intersects(that)) {
      return null;
    }
    const from = ShortDate.max(this.fromDate, that.fromDate);
    const to = ShortDate.min(this.toDate, that.toDate);
    return new Period(from, to);
  }

  intersects(that: Period): boolean {
    return (
      !that.fromDate.isAfter(this.toDate) && !this.fromDate.isAfter(that.toDate)
    );
  }

  equals(that: Period): boolean {
    return this.compareTo(that) === 0;
  }

  contains(date: ShortDate): boolean {
    return !date.isBefore(this.fromDate) && !date.isAfter(this.toDate);
  }

  containsPeriod(period: Period): boolean {
    return (
      this.fromDate.isBeforeOrEqualTo(period.fromDate) &&
      this.toDate.isAfterOrEqualTo(period.toDate)
    );
  }

  getLength(): number {
    return this.length;
  }

  isAfter(that: Period): boolean {
    return this.compareTo(that) > 0;
  }

  isAfterOrEqualTo(that: Period): boolean {
    return this.compareTo(that) >= 0;
  }

  isBefore(that: Period): boolean {
    return this.compareTo(that) < 0;
  }

  isBeforeOrEqualTo(that: Period): boolean {
    return this.compareTo(that) <= 0;
  }

  compareTo(that: Period): number {
    const cmpFrom = this.fromDate.compareTo(that.fromDate);
    if (cmpFrom !== 0) return cmpFrom < 0 ? -1 : 1;
    const cmpTo = this.toDate.compareTo(that.toDate);
    if (cmpTo !== 0) return cmpTo < 0 ? -1 : 1;
    return 0;
  }

  toString(): string {
    const isCoveredIn1Year = this.fromDate.getYear() === this.toDate.getYear();
    return `${
      isCoveredIn1Year
        ? this.fromDate.asDayAndShortMonth()
        : this.fromDate.asDayAndShortMonthAndYear()
    } - ${this.toDate.asDayAndShortMonthAndYear()}`;
  }
}
