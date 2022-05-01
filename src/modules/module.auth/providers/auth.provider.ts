import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { ErrorCodes, UnauthorizedError } from '../../../core/errors';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { UserRolesEnum } from '../../module.user/enums/user-roles.enum';
import { UserService } from '../../module.user/services/user.service';
import {
  UNAUTHORIZED_ROUTE,
  USER_ROLE_UNAUTHORIZED,
} from '../constants/auth.messages';
import { JwtPayloadDataModel } from '../models';

@Service()
export class AuthProvider {
  constructor(private readonly userService: UserService) {}

  public checkAuthentication = wrapRouteAction(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      // TODO: enable when cookies allowed
      // else if (req.cookies.token) {
      //   token = req.cookies.token;
      // }

      if (!token) {
        this.throwUnauthorizedError();
      }

      try {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as JwtPayloadDataModel;

        req.user = await this.userService.tryGetUserById(decodedToken.userId);

        next();
      } catch (error) {
        this.throwUnauthorizedError();
      }
    }
  );

  public checkRoles(allowedRoles: UserRolesEnum[]) {
    return wrapRouteAction(
      async (req: Request, res: Response, next: NextFunction) => {
        const { role } = req.user;

        if (!allowedRoles.includes(role)) {
          throw new UnauthorizedError(ErrorCodes.INVALID_AUTH_PARAMS, [
            role + USER_ROLE_UNAUTHORIZED,
          ]);
        }

        next();
      }
    );
  }

  private throwUnauthorizedError() {
    throw new UnauthorizedError(ErrorCodes.INVALID_AUTH_PARAMS, [
      UNAUTHORIZED_ROUTE,
    ]);
  }
}
