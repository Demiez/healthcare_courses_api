import * as mongoose from 'mongoose';
import { logger } from './logger.util';

export const connectMongoDB = async (mongoURI: string) => {
  try {
    const { connection } = await mongoose.connect(mongoURI);

    logger.info(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    logger.error('', error);
  }
};
