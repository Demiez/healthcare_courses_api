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
    path: '/all',
    summary: 'Seeds all available data into DB',
    responses: {
      200: {
        model: 'StandardResponseViewModel',
        description: 'Success',
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: SeederController:__seedAll`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async seedAll(req: Request, res: Response) {
    const result = await this.seederService.seedAll(req.user._id);

    return super.sendSuccessResponse(res, result);
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
    const result = await this.seederService.seedMtcs(req.user._id);

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
    path: '/all',
    parameters: {},
    summary: 'Deletes all data from DB',
    responses: {
      200: {
        model: 'StandardResponseViewModel',
        description: 'Success',
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: SeederController:__deleteAll`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async deleteMtcs(req: Request, res: Response) {
    const result = await this.seederService.deleteAll();

    return super.sendSuccessResponse(res, result);
  }
}
