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
import { MtcRequestModel } from '../request-models';
import { MtcsSearchOptionsRequestModel } from '../request-models/mtcs-search-options.rm';
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
    parameters: {
      query: {
        take: {
          name: 'take',
          required: false,
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
        skip: {
          name: 'skip',
          required: false,
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
        searchInput: {
          name: 'searchInput',
          description: 'seach is performed by name',
          required: false,
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
        sortBy: {
          name: 'sortBy',
          required: false,
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
        sortOrder: {
          name: 'sortOrder',
          required: false,
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    summary: 'Responds with info about all mtcs',
    responses: {
      200: { model: 'MtcsViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__getAllMtcs`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getAllMtcs(req: Request, res: Response) {
    const searchOptionsModel = new MtcsSearchOptionsRequestModel(req.query);

    const result = await this.mtcService.getAllMtcs(searchOptionsModel);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationGet({
    path: '/radius/{zipcode}/{distance}',
    parameters: {
      path: {
        zipcode: {
          name: 'zipcode',
          required: true,
          description: 'Zipcode of mtc location',
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
        distance: {
          name: 'distance',
          required: true,
          description: 'Distance around specified address by zipcode',
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
      query: {
        unit: {
          name: 'unit',
          required: true,
          description: 'Measurement unit: KM or MI',
          allowEmptyValue: false,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    summary:
      'Responds with info about mtcs, which can be found within specified radius',
    responses: {
      200: { model: 'MtcsViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__getMtcsWithinRadius`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getMtcsWithinRadius(req: Request, res: Response) {
    const { zipcode, distance } = req.params;
    const unit = req.query.unit as string;

    const result = await this.mtcService.getMtcsWithinRadius(
      zipcode,
      Number(distance),
      unit
    );

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationGet({
    path: '/{mtcId}',
    summary: 'Responds with info about mtc by id',
    parameters: {
      path: {
        mtcId: {
          name: 'mtcId',
          allowEmptyValue: false,
          required: true,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    responses: {
      200: { model: 'MtcViewModel' },
      404: {
        description: `
        { "errorCode": "RECORD_NOT_FOUND", "errorDetails": ['mtc not found'], "type": "NOT_FOUND" },
        `,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__getMtc`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getMtc(req: Request, res: Response) {
    const result = await this.mtcService.getMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationPost({
    path: '',
    summary: 'Creates MTC in Database',
    parameters: {
      body: {
        required: true,
        model: 'MtcRequestModel',
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
    const requestModel = new MtcRequestModel(req.body);

    const result = await this.mtcService.createMtc(requestModel);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationPut({
    path: '/{mtcId}',
    summary: 'Updates info about mtc by id',
    parameters: {
      path: {
        mtcId: {
          name: 'mtcId',
          allowEmptyValue: false,
          required: true,
          type: SwaggerDefinitionConstant.STRING,
        },
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
          "errorDetails": ["Another mtc with such name is already registered"],
          "type": "FORBIDDEN"
        }
        `,
      },
      404: {
        description: `
        { "errorCode": "RECORD_NOT_FOUND", "errorDetails": ['mtc not found'], "type": "NOT_FOUND" },
        `,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__updateMtc`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async updateMtc(req: Request, res: Response) {
    const requestModel = new MtcRequestModel(req.body);

    const result = await this.mtcService.updateMtc(
      req.params.mtcId,
      requestModel
    );

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationDelete({
    path: '/{mtcId}',
    summary: 'Delete info about mtc by id',
    parameters: {
      path: {
        mtcId: {
          name: 'mtcId',
          allowEmptyValue: false,
          required: true,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    responses: {
      200: { model: 'MtcViewModel' },
      404: {
        description: `
        { "errorCode": "RECORD_NOT_FOUND", "errorDetails": ['mtc not found'], "type": "NOT_FOUND" },
        `,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: MtcController:__getMtc`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async deleteMtc(req: Request, res: Response) {
    const result = await this.mtcService.deleteMtc(req.params.mtcId);

    return super.sendSuccessResponse(res, result);
  }
}
