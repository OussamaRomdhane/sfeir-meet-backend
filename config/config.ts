import * as dotenv from 'dotenv';

dotenv.config();

export default {
  'api-port': process.env.API_PORT,
  'google-api-key': process.env.GOOGLE_API_KEY,
};
