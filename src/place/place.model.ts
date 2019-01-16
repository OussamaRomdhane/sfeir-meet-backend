import axios from 'axios';

import config from '../../config/config';

import Geo from '../geo/geo.model';
import Rating from '../rating/rating.model';
import Recommendation from '../recommendation/recommendation.model';

export default class Place {
  id: string;
  placeId: string;
  rating: Rating;
  icon: string;
  photo: string;
  name: string;
  location: Geo;
  constructor(id: string, placeId: string, rating: Rating, icon: string, photo: string, name: string, location: Geo) {
    this.id = id;
    this.placeId = placeId;
    this.rating = rating;
    this.icon = icon;
    this.photo = photo;
    this.name = name;
    this.location = location;
  }
  toJSON() {
    return {
      id: this.id,
      placeId: this.placeId,
      rating: this.rating,
      icon: this.icon,
      photo: this.photo,
      name: this.name,
      location: this.location,
    };
  }
  static async getNearby(geo: Geo, outdoor = true): Promise<Recommendation[]> {
    let types = ['restaurant', 'cafe', 'bar'].concat(outdoor ? ['park', 'amusement_park'] : []);
    let responses = await Promise.all(
      types.map(type =>
        axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geo.lat},${
            geo.lon
          }&radius=500&type=${type}&key=${config['google-api-key']}`
        )
      )
    );
    return responses.reduce((acc, response, index) => {
      let places = [];
      places = response.data.results.map(
        data =>
          new Place(
            data.id,
            data.place_id,
            new Rating(data.rating, data.user_ratings_total),
            data.geometry.icon,
            data.photos && data.photos[0].reference,
            data.name,
            new Geo(data.geometry.location.lat, data.geometry.location.lng)
          )
      );
      return acc.concat(new Recommendation(types[index], places));
    }, []);
  }
}
