import { Config } from '../config.schema';
import 'dotenv/config';

export const ENV_CONFIG_DEVELOPMENT = {
  app: {
    nodeEnv: process.env.NODE_ENV as Config['app']['nodeEnv'],
    port: parseInt(process.env.PORT || '3000', 10),
  },

  db: {
    url: process.env.DATABASE_URL,
  },
  swagger: {
    enabled: true,
    title: 'Yarli Verify System API',
    description: 'Yarli Verify System API documentation',
    version: process.env.API_DOC_VERSION || '1.0.0',
    path: process.env.API_DOC_PATH as Config['swagger']['path'],
    openApiVersion: process.env.OPEN_API_VERSION || '1.0.0',
  },
};
