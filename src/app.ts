import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import config from '../config/config';

const app: express.Application = express();

// prettier-ignore
const
    recommendationRouter: express.Router = require("./recommendation/recommendation.router");

app.use(bodyParser.json());
app.use(cors());

app.use('/recommendations', recommendationRouter);

app.listen(config['api-port'], () => {
  console.log('Server started on port', config['api-port']);
});
