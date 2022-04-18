import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { MtcViewModel } from '../../module.mtc/models';
import { ICourseDocument } from '../db-models/course.db';
import { MinimumSkillEnum } from '../enums';

@ApiModel({
  name: 'CourseViewModel',
  description: 'Course View Model',
})
export class CourseViewModel {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    example: '00000000-1234-abcd-0000-000000000000' as any,
    required: true,
  })
  public id: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public title: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public description: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public weeksDuration: number = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public tuitionCost: number = undefined;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    enum: Object.values(MinimumSkillEnum),
    required: true,
  })
  public minimumSkill: MinimumSkillEnum = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN, required: true })
  public isScholarshipAvailable: boolean = undefined;

  @ApiModelProperty({ model: 'MtcViewModel', required: true })
  public mtc: MtcViewModel = undefined;

  constructor(body: ICourseDocument) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);
  }
}
