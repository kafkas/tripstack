export default class Stats {
  static sampleMean(...inputs: number[]): number {
    let falsyInputCount = 0;
    let sum = 0;
    inputs.forEach(input => {
      if (input) sum += input;
      else falsyInputCount++;
    });
    return sum / (inputs.length - falsyInputCount);
  }
}
