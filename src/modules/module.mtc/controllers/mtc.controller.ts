import { Request, Response } from 'express';
import { ApiOperationGet, ApiPath } from 'swagger-express-ts';
import BaseController from '../../../core/abstract/base-controller';
import { StandardResponseViewModel } from '../../../core/view-models';

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
    const result = new StandardResponseViewModel('Show all mtcs', 'success');

    return super.sendSuccessResponse(res, result);
  }

  public async getMtc(req: Request, res: Response) {
    const result = new StandardResponseViewModel(
      `Show mtc by Id: ${req.params.mtcId}`,
      'success'
    );

    return super.sendSuccessResponse(res, result);
  }

  public async createMtc(req: Request, res: Response) {
    const result = new StandardResponseViewModel('Create new mtc', 'success');

    return super.sendSuccessResponse(res, result);
  }

  public async updateMtc(req: Request, res: Response) {
    const result = new StandardResponseViewModel(
      `Update mtc by Id: ${req.params.mtcId}`,
      'success'
    );

    return super.sendSuccessResponse(res, result);
  }

  public async deleteMtc(req: Request, res: Response) {
    const result = new StandardResponseViewModel(
      `Delete mtc by Id: ${req.params.mtcId}`,
      'success'
    );

    return super.sendSuccessResponse(res, result);
  }
}

export const ModuleMtc_MtcController: MtcController = new MtcController();
