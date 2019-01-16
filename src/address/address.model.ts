import axios from 'axios';

import config from '../../config/config';

import Geo from '../geo/geo.model';

export default class Address {
  public value: string;
  constructor(value: string) {
    this.value = value;
  }
  public async toGeo(): Promise<Geo> {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${this.value}&key=${config['google-api-key']}`
    );
    const lat = response.data.results[0] && response.data.results[0].geometry.location.lat;
    const lon = response.data.results[0] && response.data.results[0].geometry.location.lng;
    return new Geo(lat, lon);
  }
  public toJSON() {
    return this.value;
  }
  public toValue() {
    return this.value;
  }
}
