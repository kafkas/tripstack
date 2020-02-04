import City from './City';
import Period from './Period';
import Residency from './Residency';
import ShortDate from './ShortDate';
import Travel from './Travel';
import Trip from './Trip';

export class IncompleteTravelHistoryError extends Error {
  lastDestination: City;
  lastArrival: ShortDate;

  constructor(lastDestination: City, lastArrival: ShortDate, message?: string) {
    super(message);
    this.lastDestination = lastDestination;
    this.lastArrival = lastArrival;
  }
}

export class TravelDateConflictError extends Error {
  origin: City;
  departure: ShortDate;
  lastArrival: ShortDate;

  constructor(
    origin: City,
    departure: ShortDate,
    lastArrival: ShortDate,
    message?: string
  ) {
    super(message);
    this.origin = origin;
    this.departure = departure;
    this.lastArrival = lastArrival;
  }
}

export class ResidencyNotExistsError extends Error {
  period: Period;

  constructor(period: Period, message?: string) {
    super(message);
    this.period = period;
  }
}

/**
 * A data type that holds a stack of Trip objects.
 */
export default class TripStack {
  private trips: Trip[];

  /**
   * Creates an array of trips from an array of travel objects, which are
   * assumed to be sorted, and a base country.
   *
   * @param {City} baseCity - The city from which the trip originates.
   * @param {Travel[]} travels - The array of travel objects sorted according
   * to the departure dates (earliest travels first).
   * @constructor
   */
  constructor(residencies: Residency[], sortedTravels: Travel[]) {
    this.trips = [];
    // An array that will temporarily hold the travels for the next trip
    let tripTravels: Travel[] = [];
    let lastDestination: City;
    let lastArrival: ShortDate;

    for (let i = 0; i < sortedTravels.length; i += 1) {
      const current = sortedTravels[i];
      const origin = current.getOrigin();
      const destination = current.getDestination();
      const departure = current.getDeparture();
      const arrival = current.getArrival();
      const period = current.getPeriod();

      const residency = Residency.findResidencyDuring(residencies, period);
      if (residency === null) {
        throw new ResidencyNotExistsError(period);
      }
      const city = residency.getCity();
      const baseCity = city;
      if (i >= 1) {
        if (!origin.equals(lastDestination))
          throw new IncompleteTravelHistoryError(lastDestination, lastArrival);
        else if (departure.isBefore(lastArrival))
          throw new TravelDateConflictError(origin, departure, lastArrival);
      }
      tripTravels.push(current);
      if (destination.equals(baseCity)) {
        // Travel ends with base country, i.e. trip is complete
        this.trips.push(new Trip(baseCity, tripTravels));
        tripTravels = [];
      } else if (i === sortedTravels.length - 1) {
        // The very last travel in the stack. Need to create an ongoing trip
        this.trips.push(new Trip(baseCity, tripTravels));
      }
      lastDestination = destination;
      lastArrival = arrival;
    }
  }

  getTrips(): Trip[] {
    return this.trips;
  }

  getTotalDuration(): number {
    return this.trips.reduce((tot, cur) => tot + cur.getDuration(), 0);
  }

  getTotalLegalDuration(): number {
    return this.trips.reduce((tot, cur) => tot + cur.getLegalDuration(), 0);
  }

  size(): number {
    return this.trips.length;
  }
}
