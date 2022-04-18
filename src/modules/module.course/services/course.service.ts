import 'reflect-metadata';

import { PopulateOptions } from 'mongoose';
import { Service, Container } from 'typedi';
import { SortOrderEnum } from '../../../core/enums';
import { ErrorCodes, NotFoundError } from '../../../core/errors';
import { IProjection } from '../../../core/interfaces';
import { StandardResponseViewModel } from '../../../core/view-models';
import { MtcService } from '../../module.mtc/services/mtc.service';
import { CourseModel, ICourseDocument } from '../db-models/course.db';
import { CoursesSortByEnum } from '../enums';
import {
  CourseRequestModel,
  CoursesSearchOptionsRequestModel,
  CoursesViewModel,
  CourseViewModel,
} from '../models';

const mtcPopulateOptions: PopulateOptions = {
  path: 'mtc',
  select: 'name description',
};
@Service()
export class CourseService {
  // private readonly mtcService = Container.get(MtcService);

  // constructor(private readonly mtcService: MtcService) {}

  public async getAllCourses(
    searchOptionsModel: CoursesSearchOptionsRequestModel,
    mtcId?: string
  ): Promise<CoursesViewModel> {
    let coursesList: Array<CourseViewModel> = [];
    let populateMtcInfo = true;
    const { searchInput, sortBy, sortOrder, skip, take } = searchOptionsModel;
    const courseQuery: { title: RegExp } = {
      ...(searchInput && { title: new RegExp(`^${searchInput}`) }),
    };

    if (mtcId) {
      Object.assign(courseQuery, { mtc: mtcId });
      populateMtcInfo = false;
    }

    const total = await this.getCountOfCoursesByQuery(courseQuery, skip, take);

    if (total) {
      const coursesSortingOptions = this.getCoursesSortQuery(sortBy, sortOrder);

      const courses = await this.getCoursesListWithLazyLoading(
        courseQuery,
        coursesSortingOptions,
        skip,
        take,
        populateMtcInfo
      );

      coursesList = courses.map((course) => new CourseViewModel(course));
    }

    return new CoursesViewModel(total, coursesList);
  }

  public async getCourse(courseId: string): Promise<CourseViewModel> {
    const course = await this.tryGetCourseById(courseId, {}, true);

    return new CourseViewModel(course);
  }

  public async createUpdateCourse(
    requestModel: CourseRequestModel
  ): Promise<void> {
    // const mtc = await this.mtcService.tryGetMtcById(requestModel.mtcId);
    // if (!requestModel.id) {
    // }
    // const course = await this.tryGetCourseById(courseId, {}, true);
    // return new CourseViewModel(course);
  }

  public async deleteCourse(
    courseId: string
  ): Promise<StandardResponseViewModel<{}>> {
    const course = await this.tryGetCourseById(courseId);

    await course.deleteOne();

    return new StandardResponseViewModel({}, undefined, 'success');
  }

  public async tryGetCourseById(
    courseId: String,
    projection: string | IProjection = {},
    isPopulate: boolean = false
  ): Promise<ICourseDocument> {
    const course = await (isPopulate
      ? CourseModel.findById(courseId, projection).populate(mtcPopulateOptions)
      : CourseModel.findById(courseId, projection));

    if (!course) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, [
        'course not found',
      ]);
    }

    return course;
  }

  public async getCountOfCoursesByQuery(
    query: Record<string, unknown> = {},
    skip?: number,
    take?: number
  ) {
    if (!isNaN(take) && !isNaN(skip)) {
      return await CourseModel.countDocuments(query).skip(skip).limit(take);
    }

    return await CourseModel.countDocuments(query);
  }

  public async getCoursesListWithLazyLoading(
    searchQuery: Record<string, unknown> = {},
    sortingOptions: Record<string, unknown> = {},
    skip?: number,
    take?: number,
    isPopulate?: boolean
  ) {
    let queryCall = CourseModel.find(searchQuery).sort(sortingOptions);

    if (!isNaN(take) && !isNaN(skip)) {
      queryCall = queryCall.skip(skip).limit(take);
    }

    if (isPopulate) {
      queryCall = queryCall.populate({
        path: 'mtc',
        select: 'name description',
      });
    }

    return await queryCall;
  }

  private getCoursesSortQuery(
    sortBy: CoursesSortByEnum,
    sortOrder: SortOrderEnum
  ) {
    const sortOrderValue = sortOrder === SortOrderEnum.ASC ? 1 : -1;
    let sortQuery = {};

    switch (sortBy) {
      case CoursesSortByEnum.WEEKS_DURATION:
        sortQuery = { weeksDuration: sortOrderValue };
        break;
      case CoursesSortByEnum.TUITION_COST:
        sortQuery = { tuitionCost: sortOrderValue };
        break;
      case CoursesSortByEnum.MINIMUM_SKILL:
        sortQuery = { minimumSkill: sortOrderValue };
        break;
      case CoursesSortByEnum.TITLE:
      default:
        sortQuery = { title: sortOrderValue };
    }

    return sortQuery;
  }
}
