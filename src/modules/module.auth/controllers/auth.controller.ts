import { Request, Response } from 'express';
import {
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
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
      200: { type: SwaggerDefinitionConstant.OBJECT },
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
}
