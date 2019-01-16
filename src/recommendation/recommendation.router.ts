import * as express from 'express';

import * as Joi from 'joi';

import Address from '../address/address.model';
import Geo from '../geo/geo.model';
import Place from '../place/place.model';
import Recommendation from './recommendation.model';

const router: express.Router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { error: validationError, value: addresses }: { error: string | null; value: string[] } = Joi.validate(
      req.query.addresses,
      Joi.array().items(Joi.string())
    );
    if (validationError) {
      throw new Error(validationError);
    }
    const geos: Geo[] = await Geo.arrayFromAddresses(addresses.map(address => new Address(address)));
    const center: Geo = Geo.getCenter(geos);
    const recommendations: Recommendation[] = await Place.getNearby(center);
    res.json({
      data: {
        addresses,
        center,
        geos,
        recommendations,
      },
      error: null,
    });
  } catch (e) {
    console.error('[ERROR]');
    console.error(e);
    res.status(500).json({ data: null, error: e.toString() });
  }
});

export default router;
