import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { IGeoJsonLocation } from '../data-models/mtc.dm';
import { CareerTypesEnum } from '../enums/career-types.enum';

@ApiModel({
  name: 'CreateMtcRequestModel',
  description: 'Create MTC Request Model',
})
export class CreateMtcRequestModel {
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

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public location: IGeoJsonLocation = undefined;

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

  constructor(body: any) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);
  }
}
