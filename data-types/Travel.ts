import Comparable from '../util/interfaces/Comparable';
import City from './City';
import Period from './Period';
import ShortDate from './ShortDate';

export interface TravelCandidate {
  id: string;
  origin: City;
  departure: ShortDate;
  destination: City;
  arrival: ShortDate;
}

/**
 * A data type that describes the departure from a country and
 * the arrival to another one.
 */
export default class Travel implements Comparable<Travel> {
  private id: string;
  private origin: City;
  private destination: City;
  private period: Period;

  static createWithRawValues(
    id: string,
    originCode: string,
    departureDateString: string,
    destinationCode: string,
    arrivalDateString: string
  ): Travel {
    return new Travel({
      id,
      origin: new City(originCode),
      departure: ShortDate.createWithYMDString(departureDateString),
      destination: new City(destinationCode),
      arrival: ShortDate.createWithYMDString(arrivalDateString),
    });
  }

  constructor({
    id,
    origin,
    departure,
    destination,
    arrival,
  }: TravelCandidate) {
    this.id = id;
    this.origin = origin;
    this.destination = destination;
    this.period = new Period(departure, arrival);
  }

  getID(): string {
    return this.id;
  }

  /** @returns The origin city. */
  getOrigin(): City {
    return this.origin;
  }

  /** @returns The departure date in local time. */
  getDeparture(): ShortDate {
    return this.period.getFrom();
  }

  /** @returns The destination city. */
  getDestination(): City {
    return this.destination;
  }

  /** @returns The arrival date in local time. */
  getArrival(): ShortDate {
    return this.period.getTo();
  }

  getPeriod(): Period {
    return this.period;
  }

  getDuration(): number {
    return this.period.getLength();
  }

  isInternational(): boolean {
    return this.origin.getCountryCode() !== this.destination.getCountryCode();
  }
}
