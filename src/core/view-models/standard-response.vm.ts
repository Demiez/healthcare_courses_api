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
export class StandardResponseViewModel extends BaseFieldResponseViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public message: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public status: string;

  constructor(message?: string, status?: string) {
    super();
    this.message = message || undefined;
    this.status = status || undefined;
  }
}
