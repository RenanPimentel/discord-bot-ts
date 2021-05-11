import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

export default {
  mongoUri: process.env.MONGO_URI || '',
  botToken: process.env.BOT_TOKEN || '',
  prefix: '!',
};
