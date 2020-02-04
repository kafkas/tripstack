import Countries from '../../assets/countries.json';

/**
 * An immutable data type that describes a country.
 */
export default class Country {
  private code: string;

  static getAllCountries(): Country[] {
    return Object.keys(Countries).map(
      (code: string): Country => new Country(code)
    );
  }

  static getCountryName(countryCode: string): string {
    Country.validate(countryCode);
    return Countries[countryCode];
  }

  constructor(code: string) {
    Country.validate(code);
    this.code = code;
    Object.freeze(this);
  }

  static validate(code: string): void {
    if (!Object.prototype.hasOwnProperty.call(Countries, code))
      throw new Error('Country code is not valid.');
  }

  getName(): string {
    return Countries[this.code];
  }

  toString(): string {
    return this.getName();
  }

  equals(that: Country): boolean {
    if (!that) return false;
    return this.code === that.code;
  }

  getCode(): string {
    return this.code;
  }
}
