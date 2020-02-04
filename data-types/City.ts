import Cities, { CountryRawItem, CityRawItem } from '../../assets/cities';
import Country from './Country';

/**
 * An immutable data type that describes a city.
 */
export default class City {
  private code: string;

  static getCities(searchTerm: string): City[] {
    const regex = new RegExp(searchTerm, 'ig');
    const citiesByCountry = Object.keys(Cities).map(countryCode => {
      const countryRaw = Cities[countryCode] as CountryRawItem;
      const citiesInCountry = Object.keys(countryRaw).map(key => {
        if (key === 'length') return null;
        const { name } = countryRaw[key];
        return {
          index: key,
          name,
        };
      });
      const filtered = citiesInCountry.filter(
        city => !!city && regex.test(city.name)
      );
      return filtered.map(city => new City(`${countryCode}-${city.index}`));
    });
    return citiesByCountry.flat(1);
  }

  constructor(code: string, skipValidation = true) {
    if (!skipValidation) {
      City.validateCode(code);
    }
    this.code = code;
    Object.freeze(this);
  }

  private static validateCode(code: string): void {
    const countryCode = City.extractCountryCode(code);
    Country.validate(countryCode);
    const cityIndex = City.extractCityIndex(code);
    if (isNaN(cityIndex))
      throw new Error('City code is not correctly formatted.');
    const countryRaw = Cities[countryCode] as CountryRawItem;
    if (cityIndex > countryRaw.count)
      throw new Error('City index is not valid.');
  }

  getCountry(): Country {
    return new Country(this.getCountryCode());
  }

  getCountryName(): string {
    return Country.getCountryName(this.getCountryCode());
  }

  equals(that: City): boolean {
    if (!that) return false;
    return this.code === that.code;
  }

  getCode(): string {
    return this.code;
  }

  getNameWithCountry(): string {
    return `${this.getName()}, ${this.getCountryCode()}`;
  }

  getName(): string {
    return this.retrieveCityRawItem().name;
  }

  getCountryCode(): string {
    return City.extractCountryCode(this.code);
  }

  private static extractCountryCode(cityCode: string): string {
    return cityCode.substring(0, 2);
  }

  getIndex(): number {
    return City.extractCityIndex(this.code);
  }

  private static extractCityIndex(cityCode: string): number {
    return Number(cityCode.substring(3, cityCode.length));
  }

  toString(): string {
    return this.getNameWithCountry();
  }

  getLatitude(): number {
    return this.getCoords()[0];
  }

  getLongitude(): number {
    return this.getCoords()[1];
  }

  /** @returns [latitude, longitude] */
  getCoords(): [number, number] {
    return this.retrieveCityRawItem().crd;
  }

  private retrieveCityRawItem(): CityRawItem {
    const countryRawItem = Cities[this.getCountryCode()] as CountryRawItem;
    return countryRawItem[this.getIndex()];
  }
}
