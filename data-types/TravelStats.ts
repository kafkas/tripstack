import Travel from './Travel';
import City from './City';

export default class TravelStats {
  private frequencyMap: Map<string, number>;

  constructor(travels: Travel[]) {
    this.frequencyMap = new Map();
    travels.forEach((travel, idx) => {
      if (idx === 0) {
        this.incrementFrequency(travel.getOrigin().getCode());
      }
      this.incrementFrequency(travel.getDestination().getCode());
    });
  }

  private incrementFrequency(cityCode: string): void {
    const curVal = this.frequencyMap.get(cityCode) || 0;
    this.frequencyMap.set(cityCode, curVal + 1);
  }

  /** @returns The number of times the user has arrived to or departed from this city. */
  getTravelFrequency(cityCode: string): number {
    if (this.frequencyMap.has(cityCode)) {
      return this.frequencyMap.get(cityCode);
    }
    return 0;
  }

  getCityCount(): number {
    return this.frequencyMap.size;
  }

  getCities(): City[] {
    const cities: City = new Array(this.getCityCount());
    let i = 0;
    this.frequencyMap.forEach((freq, cityCode) => {
      cities[i++] = new City(cityCode);
    });
    return cities;
  }
}
