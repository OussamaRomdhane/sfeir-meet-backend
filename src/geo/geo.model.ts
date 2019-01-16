import axios from 'axios';

import config from '../../config/config';

import Address from '../address/address.model';

import { degToRad, radToDeg } from 'geolocation-utils';

export default class Geo {
  public static getCenter(geos: Geo[]): Geo {
    if (!geos.length) {
      throw new Error('Must precise at least one Geo point');
    }

    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (const geo of geos) {
      const latitudeInRad: number = degToRad(geo.lat);
      const longtitudeInRad: number = degToRad(geo.lon);
      // sum of cartesian coordinates
      sumX += Math.cos(latitudeInRad) * Math.cos(longtitudeInRad);
      sumY += Math.cos(latitudeInRad) * Math.sin(longtitudeInRad);
      sumZ += Math.sin(latitudeInRad);
    }

    const avgX = sumX / geos.length;
    const avgY = sumY / geos.length;
    const avgZ = sumZ / geos.length;

    // convert average x, y, z coordinate to latitude and longtitude
    const longtitude = Math.atan2(avgY, avgX);
    const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    const latitude = Math.atan2(avgZ, hyp);
    return new Geo(radToDeg(latitude), radToDeg(longtitude));
  }
  public static async arrayFromAddresses(addresses: Address[]): Promise<Geo[]> {
    const responses = await Promise.all(
      addresses.map(address =>
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}&key=${config['google-api-key']}`
        )
      )
    );

    return responses.map(response => {
      const lat = response.data.results[0] && response.data.results[0].geometry.location.lat;
      const lon = response.data.results[0] && response.data.results[0].geometry.location.lng;
      return new Geo(lat, lon);
    });
  }
  public lat: number;
  public lon: number;
  constructor(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
  }
  public toJSON() {
    return {
      lat: this.lat,
      lon: this.lon,
    };
  }
  public toArray() {
    return [this.lat, this.lon];
  }
}
