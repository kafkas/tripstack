import City from './City';
import ShortDate from './ShortDate';
import Period from './Period';

export class MultipleCurrentsError {
  currentResidency: Residency;
  conflictPeriod: Period;

  constructor(currentResidency: Residency, conflictPeriod: Period) {
    this.currentResidency = currentResidency;
    this.conflictPeriod = conflictPeriod;
  }
}

export class ConflictInPeriodsError {
  conflictResidency: Residency;
  conflictPeriod: Period;

  constructor(conflictResidency: Residency, conflictPeriod: Period) {
    this.conflictResidency = conflictResidency;
    this.conflictPeriod = conflictPeriod;
  }
}

export interface ResidencyCandidate {
  id?: string;
  city: City;
  fromDate: ShortDate;
  toDate: ShortDate | null;
}

export default class Residency {
  private id: string;
  private city: City;
  private fromDate: ShortDate;
  private toDate: ShortDate | null;

  static findResidencyDuring(
    residencies: Residency[],
    period: Period
  ): Residency | null {
    return Residency.findResidencyDuringWithBinarySearch(
      residencies,
      0,
      residencies.length - 1,
      period
    );
  }

  private static findResidencyDuringWithBinarySearch(
    residencies: Residency[],
    lo: number,
    hi: number,
    period: Period
  ): Residency | null {
    if (hi < lo) return null;
    const mi = lo + Math.floor((hi - lo) / 2);
    const mid = residencies[mi];

    if (mid.containsPeriod(period)) {
      return mid;
    }
    if (period.isBefore(mid.getPeriod())) {
      const leftResult = Residency.findResidencyDuringWithBinarySearch(
        residencies,
        lo,
        mi - 1,
        period
      );
      if (leftResult !== null) return leftResult;
    } else {
      const rightResult = Residency.findResidencyDuringWithBinarySearch(
        residencies,
        mi + 1,
        hi,
        period
      );
      if (rightResult !== null) return rightResult;
    }
    return null;
  }

  static findResidencyAt(
    residencies: Residency[],
    date: ShortDate
  ): Residency | null {
    return Residency.findResidencyWithBinarySearch(
      residencies,
      0,
      residencies.length - 1,
      date
    );
  }

  private static findResidencyWithBinarySearch(
    residencies: Residency[],
    lo: number,
    hi: number,
    date: ShortDate
  ): Residency | null {
    if (hi < lo) return null;
    const mi = lo + Math.floor((hi - lo) / 2);
    const mid = residencies[mi];

    if (mid.containsDate(date)) {
      return mid;
    }
    if (date.isBefore(mid.getFromDate())) {
      const leftResult = Residency.findResidencyWithBinarySearch(
        residencies,
        lo,
        mi - 1,
        date
      );
      if (leftResult !== null) return leftResult;
    } else {
      const rightResult = Residency.findResidencyWithBinarySearch(
        residencies,
        mi + 1,
        hi,
        date
      );
      if (rightResult !== null) return rightResult;
    }
    return null;
  }

  /**
   * Determines whether the properties of the new residency candidate is consistent
   * with the existing Residency objects.
   * @param existingResidencies Must be sorted.
   * @throws `MultipleCurrentsError`
   * @throws `ConflictInPeriodsError`
   */
  static validateConsistency(
    residencies: Residency[],
    { id, city, fromDate, toDate }: ResidencyCandidate
  ): void {
    const N = residencies.length;
    if (N === 0) return;
    const candidateRsd = new Residency(id, city, fromDate, toDate);
    const lastRsd = residencies[N - 1];
    if (
      lastRsd.isOngoing() &&
      candidateRsd.isOngoing() &&
      candidateRsd.getID() !== lastRsd.getID()
    )
      throw new MultipleCurrentsError(
        lastRsd,
        lastRsd.getConflictPeriodWith(candidateRsd)
      );
    Residency.validateWithBinarySearch(residencies, 0, N - 1, candidateRsd);
  }

  private static validateWithBinarySearch(
    residencies: Residency[],
    lo: number,
    hi: number,
    candidate: Residency
  ): void {
    if (hi < lo) return;
    const mi = lo + Math.floor((hi - lo) / 2);
    const mid = residencies[mi];
    if (mid.getID() !== candidate.getID()) {
      const conflictPeriod = mid.getConflictPeriodWith(candidate);
      if (conflictPeriod !== null)
        throw new ConflictInPeriodsError(mid, conflictPeriod);
    }
    if (candidate.getFromDate().isBefore(mid.getFromDate()))
      Residency.validateWithBinarySearch(residencies, lo, mi - 1, candidate);
    else Residency.validateWithBinarySearch(residencies, mi + 1, hi, candidate);
  }

  static comparator(rsd1: Residency, rsd2: Residency) {
    return rsd1.getFromDate().compareTo(rsd2.getFromDate());
  }

  static createWithRawParams(
    id: string,
    cityCode: string,
    fromDateString: string,
    toDateString: string | null
  ) {
    const city = new City(cityCode);
    const fromDate = ShortDate.createWithYMDString(fromDateString);
    const toDate = toDateString
      ? ShortDate.createWithYMDString(toDateString)
      : null;
    return new Residency(id, city, fromDate, toDate);
  }

  constructor(
    id: string | undefined,
    city: City,
    fromDate: ShortDate,
    toDate: ShortDate | null
  ) {
    this.id = id;
    this.city = city;
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  conflictsWith(that: Residency) {
    return this.getConflictPeriodWith(that) !== null;
  }

  /** @returns null if there is no conflict, the period of conflict otherwise */
  getConflictPeriodWith(that: Residency): Period | null {
    if (this.isOngoing() && that.isOngoing()) {
      const later = ShortDate.max(this.getFromDate(), that.getFromDate());
      return new Period(later, ShortDate.createCurrent());
    }
    return this.getPeriod().intersection(that.getPeriod());
  }

  getID(): string {
    return this.id;
  }

  getFromDate(): ShortDate {
    return this.fromDate;
  }

  getToDate(): ShortDate | null {
    return this.toDate;
  }

  getPeriod(): Period {
    return new Period(this.fromDate, this.currentToDate());
  }

  getDuration(): number {
    return this.currentToDate().diff(this.fromDate);
  }

  containsDate(date: ShortDate): boolean {
    return this.getPeriod().contains(date);
  }

  containsPeriod(thatPeriod: Period): boolean {
    return this.getPeriod().containsPeriod(thatPeriod);
  }

  private currentToDate(): ShortDate {
    return this.isOngoing() ? ShortDate.createCurrent() : this.toDate;
  }

  isOngoing(): boolean {
    return this.toDate === null;
  }

  getCity(): City {
    return this.city;
  }

  describePeriod(): string {
    const from = this.fromDate.asShortMonthAndYear();
    const to =
      this.toDate === null ? 'Current' : this.toDate.asShortMonthAndYear();
    return `${from} - ${to}`;
  }

  equals(that: Residency): boolean {
    let toDatesAreEqual = false;
    toDatesAreEqual =
      this.toDate === null
        ? that.toDate === null
        : this.toDate.equals(that.toDate);
    return (
      this.id === that.id &&
      this.city.equals(that.city) &&
      this.fromDate.equals(that.fromDate) &&
      toDatesAreEqual
    );
  }
}
