import { escapeRegExp, isEmpty } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { SortOrderEnum } from '../../../core/enums';
import { CoursesSortByEnum } from '../enums/';

@ApiModel({
  name: 'CoursesSearchOptionsRequestModel',
  description: 'Model for courses filtering and sorting options',
})
export class CoursesSearchOptionsRequestModel {
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
    enum: Object.values(CoursesSortByEnum),
  })
  public sortBy?: CoursesSortByEnum;

  constructor(body: {
    skip?: string;
    take?: string;
    searchInput?: string;
    sortOrder?: SortOrderEnum;
    sortBy?: CoursesSortByEnum;
  }) {
    if (!isEmpty(body.skip)) {
      this.skip = parseInt(body.skip, 10);
    }

    if (!isEmpty(body.take)) {
      this.take = parseInt(body.take, 10);
    }

    this.searchInput = escapeRegExp(body.searchInput);
    this.sortBy = body.sortBy ? body.sortBy : CoursesSortByEnum.TITLE;
    this.sortOrder = body.sortOrder ? body.sortOrder : SortOrderEnum.ASC;
  }
}
