import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { IGeoJsonLocation } from '../../../core/interfaces';

@ApiModel({
  name: 'MtcLocationViewModel',
  description: 'MTC Location View Model',
})
export class MtcLocationViewModel implements IGeoJsonLocation {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public type: string = undefined;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: SwaggerDefinitionConstant.NUMBER,
    required: true,
  })
  public coordinates: Array<number> = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public formattedAddress?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public street?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public city?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public state?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public zipcode?: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public country?: string = undefined;

  constructor(data: IGeoJsonLocation) {
    const pickedBody = pick(data, keys(this));

    Object.assign(this, pickedBody);
  }
}
