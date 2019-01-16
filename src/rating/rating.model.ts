export default class Rating {
  // The rating
  public value: number;
  // Number of people who gave a rating
  public count: number;
  constructor(value: number, count: number) {
    this.value = value;
    this.count = count;
  }
  public toJSON() {
    return {
      count: this.count,
      value: this.value,
    };
  }
}
