import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { CourseViewModel } from './course.vm';

@ApiModel({
  name: 'CoursesViewModel',
  description: 'Courses View Model',
})
export class CoursesViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public total: number;

  @ApiModelProperty({
    required: true,
    type: SwaggerDefinitionConstant.ARRAY,
    model: 'CourseViewModel',
  })
  public courses: Array<CourseViewModel>;

  constructor(total: number = 0, courses: Array<CourseViewModel> = []) {
    this.total = total;
    this.courses = courses;
  }
}
