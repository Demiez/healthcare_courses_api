import { Request, Response } from 'express';
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiPath,
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

  @ApiOperationGet({
    path: '/courses',
    summary: 'Seeds courses into DB',
    responses: {
      200: {
        model: 'StandardResponseViewModel',
        description: 'Success',
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: SeederController:__seedCourses`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async seedCourses(req: Request, res: Response) {
    const result = await this.seederService.seedCourses();

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationDelete({
    path: '/mtcs',
    parameters: {},
    summary: 'Deletes all mtcs from DB',
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
  public async deleteMtcs(req: Request, res: Response) {
    const result = await this.seederService.deleteMtcs();

    return super.sendSuccessResponse(res, result);
  }
}
