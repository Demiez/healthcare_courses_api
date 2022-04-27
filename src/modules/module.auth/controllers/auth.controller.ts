import { Request, Response } from 'express';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import { UserLoginRequestModel } from '../../module.user/models';
import { UserRequestModel } from '../../module.user/models/user.rm';
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
    const result = await this.authService.registerUser(
      new UserRequestModel(req.body)
    );

    return super.sendSuccessResponse(res, result);
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
    const result = await this.authService.loginUser(
      new UserLoginRequestModel(req.body)
    );

    return super.sendSuccessResponse(res, result);
  }
}
