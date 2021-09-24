import { Response } from 'express';
import { BaseStatusesEnum } from '../enums';
import { ErrorResponse, MongoDBError } from '../errors';

export const handleMongoDBError = (error: ErrorResponse, res: Response) => {
  const fieldName = error.message
    .substring(
      error.message.lastIndexOf('.$') + 2,
      error.message.lastIndexOf('_1')
    )
    .split(' ')
    .slice(-1)[0];

  switch (error.code) {
    case 11000:
    case 11001: {
      const message = `Field <${fieldName}> has duplicate value`;
      return res
        .status(BaseStatusesEnum.BAD_REQUEST)
        .send(new MongoDBError(error.code, [{ message }]));
    }
    default:
      return res
        .status(BaseStatusesEnum.BAD_REQUEST)
        .send(
          new MongoDBError(error.code, [{ message: JSON.stringify(error) }])
        );
  }
};
