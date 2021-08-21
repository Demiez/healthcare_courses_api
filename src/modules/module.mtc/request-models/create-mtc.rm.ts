import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { IGeoJsonLocation } from '../data-models/mtc.dm';

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
  public location: IGeoJsonLocation = undefined;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.STRING,
    required: true,
  })
  public careers: Array<string> = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public averageRating: number = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public averageCost: number = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public photo: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN, required: true })
  public housing: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN, required: true })
  public jobAssistance: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN, required: true })
  public jobGuarantee: boolean = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.BOOLEAN, required: true })
  public acceptGiBill: boolean = undefined;

  constructor(body: any) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);
  }
}
