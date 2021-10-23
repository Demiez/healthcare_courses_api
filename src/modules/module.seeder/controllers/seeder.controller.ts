import { Request, Response } from 'express';
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import { SeederService } from '../services/seeder.service';

@ApiPath({
  description: 'Seeder controller',
  name: 'Seeder controller',
  path: `/seeder`,
})
@Service()
export class SeederController extends BaseController {
  constructor(private readonly seederService: SeederService) {
    super();
  }

  @ApiOperationGet({
    path: '/mtcs',
    summary: 'Seeds mtcs into DB',
    responses: {
      200: {
        model: 'StandardResponseViewModel',
        description: 'Success',
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: SeederController:__seedMtcs`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async seedMtcs(req: Request, res: Response) {
    const result = await this.seederService.seedMtcs();

    return super.sendSuccessResponse(res, result);
  }
}
