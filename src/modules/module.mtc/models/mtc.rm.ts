import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { CareerTypesEnum } from '../enums/career-types.enum';
import { MtcLocationViewModel } from './mtc-location.vm';

@ApiModel({
  name: 'MtcRequestModel',
  description: 'MTC Request Model',
})
export class MtcRequestModel {
  @ApiModelProperty({
    description: 'Id of mtc',
    type: SwaggerDefinitionConstant.STRING,
    example: '00000000-1234-abcd-0000-000000000000' as any,
  })
  public id?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public name: string = undefined;

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

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    example: '00000000-1234-abcd-0000-000000000000' as any,
  })
  public user: string = undefined;

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

  constructor(body: MtcRequestModel, userId: string) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);

    this.user = userId;
  }
}
