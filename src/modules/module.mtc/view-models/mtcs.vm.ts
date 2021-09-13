import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { MtcViewModel } from './mtc.vm';

@ApiModel({
  name: 'MtcsViewModel',
  description: 'MTCs View Model',
})
export class MtcsViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public total: number;

  @ApiModelProperty({
    required: true,
    type: SwaggerDefinitionConstant.ARRAY,
    model: 'MtcViewModel',
  })
  public mtcs: Array<MtcViewModel>;

  constructor(total: number = 0, mtcs: Array<MtcViewModel> = []) {
    this.total = total;
    this.mtcs = mtcs;
  }
}
