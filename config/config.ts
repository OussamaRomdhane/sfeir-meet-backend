import * as dotenv from 'dotenv';

dotenv.config();

export default {
  'google-api-key': process.env.GOOGLE_API_KEY,
  'api-port': process.env.API_PORT,
};
