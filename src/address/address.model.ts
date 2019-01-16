import axios from 'axios';

import config from '../../config/config';

import Geo from '../geo/geo.model';

export default class Address {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  async toGeo(): Promise<Geo> {
    let response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${this.value}&key=${config['google-api-key']}`
    );
    let lat = response.data.results[0] && response.data.results[0].geometry.location.lat;
    let lon = response.data.results[0] && response.data.results[0].geometry.location.lng;
    return new Geo(lat, lon);
  }
  toJSON() {
    return this.value;
  }
  toValue() {
    return this.value;
  }
}
