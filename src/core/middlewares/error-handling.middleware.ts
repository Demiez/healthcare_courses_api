import { Application, NextFunction, Request, Response } from 'express';
import { ErrorResponseTypes } from '../enums/error-response-types.enum';
import {
  BaseErrorCodes,
  ErrorResponse,
  InternalServerError,
  PostbackUniversalError,
} from '../errors';

export default (app: Application) => {
  app.use(
    (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
      if (error.type === ErrorResponseTypes.BAD_REQUEST) {
        const errorMessage =
          error.errorDetails && error.errorDetails.length > 0
            ? error.message + ': ' + error.errorDetails[0]
            : error.message;

        return res.status(400).send(error);
      }

      if (error.type === ErrorResponseTypes.POSTBACK_UNIVERSAL_REQUEST) {
        const universalError = error as PostbackUniversalError;

        return res.status(400).send(universalError.model);
      }

      if (error.type === ErrorResponseTypes.UNAUTHORIZED) {
        const errorMessage =
          error.errorDetails && error.errorDetails.length > 0
            ? error.message + ': ' + error.errorDetails[0]
            : error.message;

        return res.status(401).json(error);
      }

      if (error.type === ErrorResponseTypes.FORBIDDEN) {
        const errorMessage =
          error.errorDetails && error.errorDetails.length > 0
            ? error.message + ': ' + error.errorDetails[0]
            : error.message;

        return res.status(403).send(error);
      }

      if (error.type === ErrorResponseTypes.NOT_FOUND) {
        const errorMessage =
          error.errorDetails && error.errorDetails.length > 0
            ? error.message + ': ' + error.errorDetails[0]
            : error.message;

        return res.status(404).send(error);
      }

      if (error.type === ErrorResponseTypes.INTERNAL_SERVER_ERROR) {
        const errorMessage =
          error.errorDetails && error.errorDetails.length > 0
            ? error.message + ': ' + error.errorDetails[0]
            : error.message;

        return res.status(500).send(error);
      }

      // DB error handling - change according to used DB
      // if (error.code) {
      //   const errorMessage = getErrorMessage(error);

      //   const errorObject = new InternalServerError(
      //     ErrorCodes.INTERNAL_SERVER_ERROR,
      //     [`MongoError: ${errorMessage}`]
      //   );

      //   return res.status(500).send(errorObject);
      // }

      return res
        .status(500)
        .send(
          new ErrorResponse(BaseErrorCodes.INTERNAL_SERVER_ERROR, [
            { message: JSON.stringify(error) },
          ])
        );
    }
  );
};
