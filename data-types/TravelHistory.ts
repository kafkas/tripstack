import Period from './Period';
import Travel from './Travel';
import EnhancedRedBlackBST from '../util/EnhancedRedBlackBST';

export default class TravelHistory {
  private travels: EnhancedRedBlackBST<Period, Travel>;

  constructor() {
    this.travels = new EnhancedRedBlackBST<>();
  }

  add(travel: Travel): void {
    this.travels.put(travel.getPeriod(), travel);
  }

  /** @returns The number of travels in the entire history. */
  getCount(): number {
    return this.travels.size();
  }

  getTravels(): Travel[] {
    return this.travels.vals();
  }

  getTravelsReverse(): Travel[] {
    return this.travels.valsReverse();
  }
}
