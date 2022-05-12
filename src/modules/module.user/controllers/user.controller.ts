import { Request, Response } from 'express';
import { ApiOperationPatch, ApiPath } from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import { UserRequestModel } from '../../module.user/models/user.rm';
import { UserService } from '../services/user.service';

@ApiPath({
  description: 'User controller',
  name: 'User controller',
  path: `/user`,
})
@Service()
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @ApiOperationPatch({
    path: '',
    summary: 'Updates user',
    parameters: {
      body: {
        required: true,
        model: 'UserRequestModel',
      },
    },
    responses: {
      200: { model: 'UserViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: UserController:__updateUser`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async updateUser(req: Request, res: Response) {
    const result = await this.userService.updateUser(
      new UserRequestModel(req.body),
      req.user
    );

    return super.sendSuccessResponse(res, result);
  }
}
