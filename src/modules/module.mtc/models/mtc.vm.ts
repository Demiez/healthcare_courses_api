import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { MtcLocationViewModel } from '.';
import { CourseViewModel } from '../../module.course/models';
import { IMtcDocument } from '../db-models/mtc.db';
import { CareerTypesEnum } from '../enums/career-types.enum';

@ApiModel({
  name: 'MtcViewModel',
  description: 'MTC View Model',
})
export class MtcViewModel {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    example: '00000000-1234-abcd-0000-000000000000' as any,
    required: true,
  })
  public id: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public name: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public slug: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public description: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public website: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public phone: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public email: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public address: string = undefined;

  @ApiModelProperty({ model: 'MtcLocationViewModel', required: true })
  public location: MtcLocationViewModel = undefined;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.STRING,
    enum: Object.values(CareerTypesEnum),
    required: true,
  })
  public careers: Array<CareerTypesEnum> = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER })
  public averageRating?: number = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER })
  public averageCost?: number = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public photo?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN })
  public housing?: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN })
  public jobAssistance?: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN })
  public jobGuarantee?: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN })
  public acceptGiBill?: boolean = undefined;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    model: 'MtcViewModel',
    required: true,
  })
  public courses?: Array<CourseViewModel> = undefined;

  constructor(body: IMtcDocument) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);
  }
}
