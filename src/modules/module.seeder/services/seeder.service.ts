import * as fs from 'fs';
import { Service } from 'typedi';
import { StandardResponseViewModel } from '../../../core/view-models';
import { CourseModel, ICourse } from '../../module.course/db-models/course.db';
import { IMtcDocument, MtcModel } from '../../module.mtc/db-models/mtc.db';

@Service()
export class SeederService {
  public async seedMtcs() {
    const mtcs: IMtcDocument[] = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/mtcs.json`, 'utf-8')
    );

    await MtcModel.create(mtcs);

    return new StandardResponseViewModel(
      undefined,
      'Mtc data imported',
      'success'
    );
  }

  public async seedCourses() {
    const courses: ICourse[] = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/courses.json`, 'utf-8')
    );

    await CourseModel.create(courses);

    return new StandardResponseViewModel(
      undefined,
      'Courses data imported',
      'success'
    );
  }

  public async deleteMtcs() {
    await MtcModel.deleteMany();

    return new StandardResponseViewModel(
      undefined,
      'Mtc data deleted',
      'success'
    );
  }
}
