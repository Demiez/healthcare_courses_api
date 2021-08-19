import * as mongoose from 'mongoose';
import { logger } from './logger.util';

export const connectMongoDB = async (mongoURI: string) => {
  try {
    const { connection } = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    logger.error('', error);
  }
};
