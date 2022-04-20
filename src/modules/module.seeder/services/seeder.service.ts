import * as fs from 'fs';
import { Service } from 'typedi';
import { StandardResponseViewModel } from '../../../core/view-models';
import { CourseModel, ICourse } from '../../module.course/db-models/course.db';
import { IMtcDocument, MtcModel } from '../../module.mtc/db-models/mtc.db';

@Service()
export class SeederService {
  public async seedAll() {
    await this.seedMtcs();
    await this.seedCourses(); // Must be executed after for cost calculation

    return new StandardResponseViewModel(
      undefined,
      'Mtcs/Courses data imported',
      'success'
    );
  }

  public async seedMtcs() {
    const mtcs: Array<IMtcDocument> = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/mtcs.json`, 'utf-8')
    );

    await MtcModel.create(mtcs);

    return new StandardResponseViewModel(
      undefined,
      'Mtcs data imported',
      'success'
    );
  }

  public async seedCourses() {
    const courses: Array<ICourse> = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/courses.json`, 'utf-8')
    );

    await CourseModel.create(courses);

    return new StandardResponseViewModel(
      undefined,
      'Courses data imported',
      'success'
    );
  }

  public async deleteAll() {
    await Promise.all([MtcModel.deleteMany(), CourseModel.deleteMany()]);

    return new StandardResponseViewModel(
      undefined,
      'All data removed',
      'success'
    );
  }
}
