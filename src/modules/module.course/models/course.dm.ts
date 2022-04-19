import { keys, pick } from 'lodash';
import { MinimumSkillEnum } from '../enums';
import { CourseRequestModel } from './course.rm';

export class CourseDataModel {
  public _id: string = undefined;
  public title: string = undefined;
  public description: string = undefined;
  public weeksDuration: number = undefined;
  public tuitionCost: number = undefined;
  public minimumSkill: MinimumSkillEnum = undefined;
  public isScholarshipAvailable: boolean = undefined;
  public mtc: string = undefined;

  constructor(body: CourseRequestModel, mtcId: string) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);

    this.mtc = mtcId;

    if (body.id) {
      this._id = body.id;
    }
  }
}
