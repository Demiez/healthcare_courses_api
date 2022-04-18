import { escapeRegExp, isEmpty } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { SortOrderEnum } from '../../../core/enums';
import { MtcsSortByEnum } from '../enums';

@ApiModel({
  name: 'MtcsSearchOptionsRequestModel',
  description: 'Model for mtcs filtering and sorting options',
})
export class MtcsSearchOptionsRequestModel {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
  })
  public skip?: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
  })
  public take?: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
  })
  public searchInput?: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    enum: Object.values(SortOrderEnum),
  })
  public sortOrder?: SortOrderEnum;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    enum: Object.values(MtcsSortByEnum),
  })
  public sortBy?: MtcsSortByEnum;

  constructor(body: {
    skip?: string;
    take?: string;
    searchInput?: string;
    sortOrder?: SortOrderEnum;
    sortBy?: MtcsSortByEnum;
  }) {
    if (!isEmpty(body.skip)) {
      this.skip = parseInt(body.skip, 10);
    }

    if (!isEmpty(body.take)) {
      this.take = parseInt(body.take, 10);
    }

    this.searchInput = escapeRegExp(body.searchInput);
    this.sortBy = body.sortBy ? body.sortBy : MtcsSortByEnum.MTC_NAME;
    this.sortOrder = body.sortOrder ? body.sortOrder : SortOrderEnum.ASC;
  }
}
