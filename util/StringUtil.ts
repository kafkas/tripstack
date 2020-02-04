export default class ObjectUtil {
  /**
   * An extremely simple and (potentially) highly inaccurate pluraliser for reducing repetitive code.
   *
   * Warning: Do not use with dynamic inputs!
   */
  static pluralise(
    str: string,
    count: number,
    showCount: boolean,
    pluralForm: string
  ): string {
    if (count === 1) return `${showCount ? `${count} ${str}` : str}`;
    const strPlural = pluralForm || `${str}s`;
    return `${showCount ? `${count} ${strPlural}` : strPlural}`;
  }

  static isValidEmail(str: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(str).toLowerCase());
  }

  static isValidPassword(str: string) {
    return str.length >= 6;
  }
}
