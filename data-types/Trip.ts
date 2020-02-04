import City from './City';
import ShortDate from './ShortDate';
import Travel from './Travel';

/** A data type that describes a trip. */
export default class Trip {
  private baseCity: City;
  private travels: Travel[];

  /** Creates a Trip object from an array of Travel objects. */
  constructor(baseCity: City, travels: Travel[]) {
    this.baseCity = baseCity;
    this.travels = travels;
  }

  getBaseCity(): City {
    return this.baseCity;
  }

  getCities(): City[] {
    const cities = [];
    let lastCity = this.firstTravel().getOrigin();
    this.travels.forEach((travel, index): void => {
      const orig = travel.getOrigin();
      const dest = travel.getDestination();
      if (index === 0 && !orig.equals(this.baseCity)) cities.push(orig);
      if (!dest.equals(lastCity) && !dest.equals(this.baseCity)) {
        cities.push(dest);
        lastCity = dest;
      }
    });
    return cities;
  }

  getUniqueCityCount(): number {
    const citiesSet = new Set<string>();
    this.getCities().forEach(city => {
      citiesSet.add(city.getCode());
    });
    return citiesSet.size;
  }

  getUniqueCountryCount(): number {
    const countriesSet = new Set<string>();
    this.getCities().forEach(city => {
      countriesSet.add(city.getCountryCode());
    });
    return countriesSet.size;
  }

  /**
   * Computes the legal duration of the trip as prescribed by the UK Home Office.
   *
   * TODO: Verify.
   */
  getLegalDuration(): number {
    const dur = this.getDuration();
    if (dur < 0) return dur + 1;
    if (dur === 0) return 0;
    return dur - 1;
  }

  hasUnknownStart(): boolean {
    return this.getStartDate() === null;
  }

  isOngoing(): boolean {
    return this.getEndDate() === null;
  }

  /**
   * @returns The duration of the trip, in number of days. If the start date
   * is unknown, considers the departure date of the first travel as the start
   * date. If the end date is unknown, considers the current date as the end
   * date.
   */
  getDuration(): number {
    return this.knownEndDate().diff(this.knownStartDate());
  }

  private knownStartDate(): ShortDate {
    return this.hasUnknownStart()
      ? this.firstTravel().getDeparture()
      : this.getStartDate();
  }

  private knownEndDate(): ShortDate {
    let end = this.getEndDate();
    if (this.isOngoing()) {
      end = ShortDate.createCurrent();
      const lastArrival = this.lastTravel().getArrival();
      if (lastArrival.isAfter(end)) {
        // Trip includes future travels
        end = lastArrival;
      }
    }
    return end;
  }

  getStartDate(): ShortDate | null {
    return this.baseCity.equals(this.firstTravel().getOrigin())
      ? this.firstTravel().getDeparture()
      : null;
  }

  getEndDate(): ShortDate | null {
    return this.baseCity.equals(this.lastTravel().getDestination())
      ? this.lastTravel().getArrival()
      : null;
  }

  private firstTravel(): Travel {
    return this.travels[0];
  }

  private lastTravel(): Travel {
    return this.travels[this.travels.length - 1];
  }

  /** @returns An array of `Travel` objects associated with the trip. */
  getTravels(): Travel[] {
    return this.travels;
  }

  describePeriod(): string {
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();
    const tookPlaceIn1Year =
      startDate !== null &&
      endDate !== null &&
      startDate.getYear() === endDate.getYear();
    const from = this.hasUnknownStart()
      ? 'Unknown'
      : tookPlaceIn1Year
      ? startDate.asDayAndShortMonth()
      : startDate.asDayAndShortMonthAndYear();
    const to = this.isOngoing()
      ? 'Ongoing'
      : endDate.asDayAndShortMonthAndYear();
    return `${from} - ${to}`;
  }
}
