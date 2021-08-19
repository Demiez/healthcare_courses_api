import app from './app';
import { connectMongoDB, logger } from './core/utils';

const port: string | number = process.env.PORT;
const env: string = process.env.NODE_ENV;
const mongoURI: string = process.env.MONGO_URI;

connectMongoDB(mongoURI);

app.listen(port, () =>
  logger.info(`Server running in ${env} mode on port: ${port}`)
);
