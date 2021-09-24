import { Application, NextFunction, Request, Response } from 'express';
import { BaseStatusesEnum } from '../enums';
import { ErrorResponseTypes } from '../enums/error-response-types.enum';
import {
  BaseErrorCodes,
  ErrorResponse,
  PostbackUniversalError,
} from '../errors';
import { handleMongoDBError } from '../utils';

export default (app: Application) => {
  app.use(
    (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
      if (error.code) {
        return handleMongoDBError(error, res);
      }

      switch (error.type) {
        case ErrorResponseTypes.BAD_REQUEST:
          return res.status(BaseStatusesEnum.BAD_REQUEST).send(error);

        case ErrorResponseTypes.POSTBACK_UNIVERSAL_REQUEST: {
          const universalError = error as PostbackUniversalError;

          return res
            .status(BaseStatusesEnum.BAD_REQUEST)
            .send(universalError.model);
        }

        case ErrorResponseTypes.UNAUTHORIZED:
          return res.status(BaseStatusesEnum.UNAUTHORIZED).send(error);

        case ErrorResponseTypes.FORBIDDEN:
          return res.status(BaseStatusesEnum.FORBIDDEN).send(error);

        case ErrorResponseTypes.NOT_FOUND:
          return res.status(BaseStatusesEnum.NOT_FOUND).send(error);

        case ErrorResponseTypes.INTERNAL_SERVER_ERROR:
          return res.status(BaseStatusesEnum.INTERNAL_SERVER_ERROR).send(error);

        default:
          return res
            .status(BaseStatusesEnum.INTERNAL_SERVER_ERROR)
            .send(
              new ErrorResponse(BaseErrorCodes.INTERNAL_SERVER_ERROR, [
                { message: JSON.stringify(error) },
              ])
            );
      }
    }
  );
};
