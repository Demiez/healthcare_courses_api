import { Request, Response } from 'express';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import { StandardResponseViewModel } from '../../../core/view-models';
import { IUserDocument } from '../../module.user/db-models/user.db';
import { UserLoginRequestModel } from '../../module.user/models';
import { UserRequestModel } from '../../module.user/models/user.rm';
import { JwtTokenViewModel } from '../models';
import { AuthService } from '../services/auth.service';

@ApiPath({
  description: 'Authentication controller',
  name: 'Auth controller',
  path: `/auth`,
})
@Service()
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiOperationPost({
    path: '/register',
    summary: 'Registers user',
    parameters: {
      body: {
        required: true,
        model: 'UserRequestModel',
      },
    },
    responses: {
      200: { model: 'JwtTokenViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: AuthController:__registerUser`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async registerUser(req: Request, res: Response) {
    const [user, data] = await this.authService.registerUser(
      new UserRequestModel(req.body)
    );

    return super.sendTokenResponse<
      IUserDocument,
      StandardResponseViewModel<JwtTokenViewModel>
    >(res, user, data);
  }

  @ApiOperationPost({
    path: '/login',
    summary: 'Logs in user',
    parameters: {
      body: {
        required: true,
        model: 'UserLoginRequestModel',
      },
    },
    responses: {
      200: { model: 'JwtTokenViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: AuthController:__loginUser`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async loginUser(req: Request, res: Response) {
    const [user, data] = await this.authService.loginUser(
      new UserLoginRequestModel(req.body)
    );

    return super.sendTokenResponse<
      IUserDocument,
      StandardResponseViewModel<JwtTokenViewModel>
    >(res, user, data);
  }

  @ApiOperationGet({
    path: '/current-user',
    summary: 'Responds with info about current logged in user',
    responses: {
      200: { model: 'UserViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: authController:__getCurrentUser`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getCurrentUser(req: Request, res: Response) {
    const result = this.authService.getCurrentUser(req.user);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationPost({
    path: '/forgot-password',
    summary: 'Sends restore password data to email',
    parameters: {
      body: {
        required: true,
        model: 'UserLoginRequestModel',
      },
    },
    responses: {
      200: { model: 'ResetPasswordTokenViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: AuthController:__processForgotPassword`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async processForgotPassword(req: Request, res: Response) {
    const result = await this.authService.processForgotPassword(
      new UserLoginRequestModel(req.body),
      req
    );

    return super.sendSuccessResponse(res, result);
  }
}
