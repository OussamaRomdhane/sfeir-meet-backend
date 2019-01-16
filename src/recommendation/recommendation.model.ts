import Place from '../place/place.model';

export default class Recommendation {
  type: string;
  places: Place[];
  constructor(type: string, places: Place[]) {
    this.type = type;
    this.places = places;
  }
  toJSON() {
    return {
      type: this.type,
      places: this.places,
    };
  }
}
