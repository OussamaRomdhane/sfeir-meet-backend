import Place from '../place/place.model';

export default class Recommendation {
  public type: string;
  public places: Place[];
  constructor(type: string, places: Place[]) {
    this.type = type;
    this.places = places;
  }
  public toJSON() {
    return {
      places: this.places,
      type: this.type,
    };
  }
}
