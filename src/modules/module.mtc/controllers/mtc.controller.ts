import { Request, Response } from 'express';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import { CreateMtcRequestModel } from '../request-models';
import { MtcService } from '../services/mtc.service';

@ApiPath({
  description: 'Mtc controller',
  name: 'Mtc controller',
  path: `/mtcs`,
})
@Service()
export class MtcController extends BaseController {
  constructor(private readonly mtcService: MtcService) {
    super();
  }

  @ApiOperationGet({
    path: '',
    summary: 'Responds with info about all mtcs',
    responses: {
      200: { model: 'StandardResponseViewModel' },
      403: {
        description: `BaseErrorSubCodes.INVALID_INPUT_PARAMS_IS_BAD_VALUE, ["field is not valid"]`,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__getAllMtcs`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getAllMtcs(req: Request, res: Response) {
    const result = this.mtcService.getAllMtcs();

    return super.sendSuccessResponse(res, result);
  }

  public async getMtc(req: Request, res: Response) {
    const result = this.mtcService.getMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationPost({
    path: '',
    summary: 'Creates MTC in Database',
    parameters: {
      body: {
        required: true,
        model: 'CreateMtcRequestModel',
      },
    },
    responses: {
      200: { model: 'MtcViewModel' },
      403: {
        description: `
        { 
          "errorCode": "INVALID_INPUT_PARAMS", 
          "errorDetails": [ { "field": ["field_name"] } ], 
          "type": "FORBIDDEN" 
        },
        { 
          "errorCode": "MTC_NAME_IS_ALREADY_REGISTERED",
          "errorDetails": ["MTC with such name is already registered"],
          "type": "FORBIDDEN"
        }
        `,
      },
      500: {
        description: `
        INTERNAL_SERVER_ERROR: MtcController:__createMtc
        `,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async createMtc(req: Request, res: Response) {
    const requestModel = new CreateMtcRequestModel(req.body);

    const result = await this.mtcService.createMtc(requestModel);

    return super.sendSuccessResponse(res, result);
  }

  public async updateMtc(req: Request, res: Response) {
    const result = this.mtcService.updateMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }

  public async deleteMtc(req: Request, res: Response) {
    const result = this.mtcService.deleteMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }
}
