import * as express from 'express';

import * as Joi from 'joi';

import Geo from '../geo/geo.model';
import Address from '../address/address.model';
import Place from '../place/place.model';
import Recommendation from './recommendation.model';

const router: express.Router = require('express').Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    let { error: validationError, value: addresses }: { error: string | null; value: string[] } = Joi.validate(
      req.query.addresses,
      Joi.array().items(Joi.string())
    );
    if (validationError) {
      throw new Error(validationError);
    }
    let geos: Geo[] = await Geo.arrayFromAddresses(addresses.map(address => new Address(address)));
    let center: Geo = Geo.getCenter(geos);
    let recommendations: Recommendation[] = await Place.getNearby(center);
    res.json({
      error: null,
      data: {
        recommendations,
        addresses,
        geos,
        center,
      },
    });
  } catch (e) {
    console.error('[ERROR]');
    console.error(e);
    res.status(500).json({ error: e.toString(), data: null });
  }
});

module.exports = router;
