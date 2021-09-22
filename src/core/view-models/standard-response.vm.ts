import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { BaseFieldResponseViewModel } from './base-field-response.vm';

@ApiModel({
  name: 'StandardResponseViewModel',
  description: 'Standard Response Model',
})
export class StandardResponseViewModel<T> extends BaseFieldResponseViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.OBJECT })
  public result: T;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public message: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public status: string;

  constructor(result?: T, message?: string, status?: string) {
    super();
    this.result = result;
    this.message = message;
    this.status = status;
  }
}
