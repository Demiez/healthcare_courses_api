import { MongoMemoryServer } from 'mongodb-memory-server-core';
import * as mongoose from 'mongoose';
import { logger } from './logger.util';

export class MongoMockHelper {
  public mongoMock: MongoMemoryServer;
  public mongoUri: string;

  public openConnection() {
    return new Promise(async (resolve, reject) => {
      this.mongoMock = await MongoMemoryServer.create({
        binary: {
          version: '4.4.0',
        },
      });

      this.mongoUri = this.mongoMock.getUri();

      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };

      mongoose.connect(this.mongoUri, connectionOptions).catch((e) => {
        logger.error('Test DB connection error: ' + e);
        reject(e);
      });

      mongoose.connection.on('connected', async () => {
        logger.info('Test DB connection is now open');
        resolve(undefined);
      });
    });
  }

  public async closeConnection() {
    logger.info('Test DB schema has been closed');
    mongoose.connection.removeAllListeners();
    await mongoose.connection.close();
    const response = await mongoose.disconnect();
    await this.mongoMock.stop();
    return response;
  }
}
