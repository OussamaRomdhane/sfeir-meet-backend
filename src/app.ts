import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import config from '../config/config';

import recommendationRouter from './recommendation/recommendation.router';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/recommendations', recommendationRouter);

app.listen(config['api-port'], () => {
  console.info('Server started on port', config['api-port']);
});
