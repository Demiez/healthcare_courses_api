import { Request, Response } from 'express';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import BaseController from '../../../core/abstract/base-controller';
import { CreateMtcRequestModel } from '../request-models';
import { ModuleMtc_MtcService } from '../services/mtc.service';

@ApiPath({
  description: 'Mtc controller',
  name: 'Mtc controller',
  path: `/mtcs`,
})
class MtcController extends BaseController {
  @ApiOperationGet({
    path: '',
    summary: 'Responds with info about all mtcs',
    responses: {
      200: { model: 'StandardResponseViewModel' },
      403: {
        description: `BaseErrorSubCodes.INVALID_INPUT_PARAMS_IS_BAD_VALUE, ["field is not valid"]`,
      },
      500: {
        description: `
        INTERNAL_SERVER_ERROR: ModuleMtc_MtcController:__getAllMtcs
        `,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getAllMtcs(req: Request, res: Response) {
    const result = ModuleMtc_MtcService.getAllMtcs();

    return super.sendSuccessResponse(res, result);
  }

  public async getMtc(req: Request, res: Response) {
    const result = ModuleMtc_MtcService.getMtc(req.params.mtcId);

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
      200: { model: 'StandardResponseViewModel' },
      403: {
        description: `
        { "errorCode": "INVALID_INPUT_PARAMS", 
          "errorDetails": [
            {
              "field": ["email"]
            }
          ], 
          "type": "FORBIDDEN" },
        `,
      },
      500: {
        description: `
        INTERNAL_SERVER_ERROR: ModuleMtc_MtcController:__createMtc
        `,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async createMtc(req: Request, res: Response) {
    const requestModel = new CreateMtcRequestModel(req.body);

    const result = ModuleMtc_MtcService.createMtc(requestModel);

    return super.sendSuccessResponse(res, result);
  }

  public async updateMtc(req: Request, res: Response) {
    const result = ModuleMtc_MtcService.updateMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }

  public async deleteMtc(req: Request, res: Response) {
    const result = ModuleMtc_MtcService.deleteMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }
}

export const ModuleMtc_MtcController: MtcController = new MtcController();
