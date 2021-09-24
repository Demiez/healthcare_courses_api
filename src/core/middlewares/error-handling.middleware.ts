import { Application, NextFunction, Request, Response } from 'express';
import { BaseStatusesEnum } from '../enums';
import { ErrorResponseTypes } from '../enums/error-response-types.enum';
import {
  BaseErrorCodes,
  ErrorResponse,
  PostbackUniversalError,
} from '../errors';

export default (app: Application) => {
  app.use(
    (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
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

      // DB error handling - change according to used DB
      // const errorMessage =
      // error.errorDetails && error.errorDetails.length > 0
      //   ? error.message + ': ' + error.errorDetails[0]
      //   : error.message;

      // if (error.code) {
      //   const errorMessage = getErrorMessage(error);

      //   const errorObject = new InternalServerError(
      //     ErrorCodes.INTERNAL_SERVER_ERROR,
      //     [`MongoError: ${errorMessage}`]
      //   );

      //   return res.status(500).send(errorObject);
      // }
    }
  );
};
