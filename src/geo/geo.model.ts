import axios from 'axios';

import config from '../../config/config';

import Address from '../address/address.model';

import { degToRad, radToDeg } from 'geolocation-utils';

export default class Geo {
  lat: number;
  lon: number;
  constructor(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
  }
  static getCenter(geos: Geo[]): Geo {
    if (!geos.length) {
      throw new Error('Must precise at least one Geo point');
    }

    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (let i = 0; i < geos.length; i++) {
      let lat = degToRad(geos[i].lat);
      let lng = degToRad(geos[i].lon);
      // sum of cartesian coordinates
      sumX += Math.cos(lat) * Math.cos(lng);
      sumY += Math.cos(lat) * Math.sin(lng);
      sumZ += Math.sin(lat);
    }

    let avgX = sumX / geos.length;
    let avgY = sumY / geos.length;
    let avgZ = sumZ / geos.length;

    // convert average x, y, z coordinate to latitude and longtitude
    let lng = Math.atan2(avgY, avgX);
    let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    let lat = Math.atan2(avgZ, hyp);
    return new Geo(radToDeg(lat), radToDeg(lng));
  }
  toJSON() {
    return {
      lat: this.lat,
      lon: this.lon,
    };
  }
  toArray() {
    return [this.lat, this.lon];
  }
  static async arrayFromAddresses(addresses: Address[]): Promise<Geo[]> {
    let responses = await Promise.all(
      addresses.map(address =>
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}&key=${config['google-api-key']}`
        )
      )
    );

    return responses.map(response => {
      let lat = response.data.results[0] && response.data.results[0].geometry.location.lat;
      let lon = response.data.results[0] && response.data.results[0].geometry.location.lng;
      return new Geo(lat, lon);
    });
  }
}
