export default class Rating {
  // The rating
  value: number;
  // Number of people who gave a rating
  count: number;
  constructor(value: number, count: number) {
    this.value = value;
    this.count = count;
  }
  toJSON() {
    return {
      value: this.value,
      count: this.count,
    };
  }
}
