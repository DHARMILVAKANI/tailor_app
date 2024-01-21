import * as dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  environment: process.env.NODE_ENV,
  app: {
    port: process.env.APP_PORT,
    database: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
  },
};
