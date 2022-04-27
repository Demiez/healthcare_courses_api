import { Response } from 'express';
import { DAY_DURATION_IN_MS } from '../constants';
import { ErrorResponse } from '../errors/error-response';
import { ICookieOptions } from '../interfaces';

export default class BaseController {
  /**
   * Send 200 success response
   * @param res
   * @param data
   */
  public sendSuccessResponse(res: Response, data: any = {}): Response {
    return res.status(200).json(data);
  }
  /**
   * Send response for unauthorized request
   * @param res
   * @param error
   */
  public sendUnauthorized(res: Response, error: ErrorResponse): Response {
    return res.status(401).json(error);
  }
  /**
   * Used for sending validation and handling errors to the client
   * @param res
   * @param error
   */
  public sendForbidden(res: Response, error: ErrorResponse): Response {
    // console.log(`ERROR 403: ${error}`);
    return res.status(403).send(error);
  }
  /**
   * Send response in case when requested data was not found
   * @param res
   * @param error
   */
  public sendNotFound(res: Response, error: ErrorResponse = null): Response {
    // console.log(`ERROR 404: ${error}`);
    return res.status(404).send(error);
  }
  /**
   * Send information about any unexpected error on the server
   * @param res
   * @param error
   */
  public sendInternalServerError(
    res: Response,
    error: ErrorResponse
  ): Response {
    return res.status(500).send(error);
  }

  /**
   * Send token response for auth requests
   * @param res
   * @param entity
   */
  public sendTokenResponse<T extends { getSignedJwtToken: () => string }, V>(
    res: Response,
    authEntity: T,
    data: V
  ): Response {
    const token = authEntity.getSignedJwtToken();

    const options: ICookieOptions = {
      expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * DAY_DURATION_IN_MS
      ),
      httpOnly: true,
      path: '/',
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    return res
      .status(200)
      .cookie('token', token, options)
      .json(Object.assign(data, { result: { token } }));
  }
}
