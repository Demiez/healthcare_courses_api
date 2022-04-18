import { Request, Response } from 'express';
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { Service } from 'typedi';
import BaseController from '../../../core/abstract/base-controller';
import {
  CourseRequestModel,
  CoursesSearchOptionsRequestModel,
} from '../models';
import { CourseService } from '../services/course.service';

@ApiPath({
  description: 'Course controller',
  name: 'Course controller',
  path: `/courses`,
})
@Service()
export class CourseController extends BaseController {
  constructor(private readonly courseService: CourseService) {
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
          description: 'seach is performed by title',
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
    summary: 'Responds with info about all courses',
    responses: {
      200: { model: 'CoursesViewModel' },
      500: {
        description: `INTERNAL_SERVER_ERROR: CourseController:__getAllCourses`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getAllCourses(req: Request, res: Response) {
    const searchOptionsModel = new CoursesSearchOptionsRequestModel(req.query);

    const result = await this.courseService.getAllCourses(searchOptionsModel);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationGet({
    path: '/{courseId}',
    summary: 'Responds with info about course by id',
    parameters: {
      path: {
        courseId: {
          name: 'courseId',
          allowEmptyValue: false,
          required: true,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    responses: {
      200: { model: 'CourseViewModel' },
      404: {
        description: `
        { "errorCode": "RECORD_NOT_FOUND", "errorDetails": ['course not found'], "type": "NOT_FOUND" },
        `,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: CourseController:__getCourse`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async getCourse(req: Request, res: Response) {
    const result = await this.courseService.getCourse(req.params.courseId);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationPost({
    path: '',
    summary: 'Creates Course in Database',
    parameters: {
      body: {
        required: true,
        model: 'CourseRequestModel',
      },
    },
    responses: {
      200: { model: 'CourseViewModel' },
      403: {
        description: `
        { 
          "errorCode": "INVALID_INPUT_PARAMS", 
          "errorDetails": [ { "field": ["field_name"] } ], 
          "type": "FORBIDDEN" 
        },
        `,
      },
      500: {
        description: `
        INTERNAL_SERVER_ERROR: CourseController:__createCourse
        `,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async createUpdateCourse(req: Request, res: Response) {
    const requestModel = new CourseRequestModel(req.body);

    const result = await this.courseService.createUpdateCourse(requestModel);

    return super.sendSuccessResponse(res, result);
  }

  @ApiOperationDelete({
    path: '/{courseId}',
    summary: 'Delete info about course by id',
    parameters: {
      path: {
        courseId: {
          name: 'courseId',
          allowEmptyValue: false,
          required: true,
          type: SwaggerDefinitionConstant.STRING,
        },
      },
    },
    responses: {
      200: { model: 'CourseViewModel' },
      404: {
        description: `
        { "errorCode": "RECORD_NOT_FOUND", "errorDetails": ['course not found'], "type": "NOT_FOUND" },
        `,
      },
      500: {
        description: `INTERNAL_SERVER_ERROR: CourseController:__deleteCourse`,
      },
    },
    security: {
      basicAuth: [],
    },
  })
  public async deleteCourse(req: Request, res: Response) {
    const result = await this.courseService.deleteCourse(req.params.courseId);

    return super.sendSuccessResponse(res, result);
  }
}
