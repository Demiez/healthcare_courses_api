import { existsSync } from 'fs';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { Service } from 'typedi';
import { BaseStatusesEnum, SortOrderEnum } from '../../../core/enums';
import {
  BadRequestError,
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection, ISearchQuery } from '../../../core/interfaces';
import { geocoder } from '../../../core/utils';
import { StandardResponseViewModel } from '../../../core/view-models';
import {
  CourseRequestModel,
  CoursesViewModel,
  CourseViewModel,
} from '../../module.course/models';
import { CourseService } from '../../module.course/services/course.service';
import { MtcRequestModelValidator } from '../../module.validation';
import { GetWithinRadiusValidator } from '../../module.validation/validators/get-within-radius.validator';
import { MtcPhotolValidator } from '../../module.validation/validators/mtc-photo.validator';
import {
  EARTH_RADIUS_IN_KM,
  EARTH_RADIUS_IN_MI,
  MTC_COURSE_CREATED_MESSAGE,
  MTC_COURSE_UPDATED_MESSAGE,
  MTC_NAME_IS_ALREADY_REGISTERED_MESSAGE,
  MTC_NOT_FOUND_MESSAGE,
  MTC_PHOTO_SAVE_MESSAGE,
} from '../constants';
import { IMtcDocument, MtcModel } from '../db-models/mtc.db';
import { MeasurementUnitsEnum, MtcsSortByEnum } from '../enums';
import {
  MtcPhotoViewModel,
  MtcRequestModel,
  MtcsSearchOptionsRequestModel,
  MtcsViewModel,
  MtcViewModel,
} from '../models';
import { MtcPhotoDataModel } from '../models/mtc-photo.dm';

@Service()
export class MtcService {
  constructor(private readonly courseService: CourseService) {}

  public async getAllMtcs(
    searchOptionsModel: MtcsSearchOptionsRequestModel
  ): Promise<MtcsViewModel> {
    let mtcsList: Array<MtcViewModel> = [];
    const { searchInput, sortBy, sortOrder, skip, take } = searchOptionsModel;
    const mtcQuery = {
      ...(searchInput && { name: new RegExp(`^${searchInput}`) }),
    };

    const total = await this.getCountOfMtcsByQuery(mtcQuery, skip, take);

    if (total) {
      const mtcsSortingOptions = this.getMtcsSortQuery(sortBy, sortOrder);

      const mtcs = await this.getMtcsListWithLazyLoading(
        mtcQuery,
        mtcsSortingOptions,
        skip,
        take
      );

      mtcsList = mtcs.map((mtc) => new MtcViewModel(mtc));
    }

    return new MtcsViewModel(total, mtcsList);
  }

  public async getMtcsWithinRadius(
    zipcode: string,
    distance: number,
    unit: string
  ): Promise<MtcsViewModel> {
    this.validateGetMtcsWithinRadiusParams(zipcode, distance, unit);

    const { latitude, longitude } = await geocoder.geocodeCoordinates(zipcode);
    const earthRadius: number =
      unit === MeasurementUnitsEnum.KM
        ? EARTH_RADIUS_IN_KM
        : EARTH_RADIUS_IN_MI;

    const radiusInRadians = distance / earthRadius;

    const mtcsWithinRadius = await MtcModel.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radiusInRadians] },
      },
    });

    return new MtcsViewModel(
      mtcsWithinRadius.length,
      mtcsWithinRadius.map((mtc) => new MtcViewModel(mtc))
    );
  }

  public async getMtc(mtcId: string): Promise<MtcViewModel> {
    const mtc = await this.tryGetMtcById(mtcId);

    return new MtcViewModel(mtc);
  }

  public async createMtc(requestModel: MtcRequestModel): Promise<MtcViewModel> {
    this.validateMtcRequestModel(requestModel);

    const isMtcRegistered = await this.checkIsMtcNameRegistered(
      requestModel.name
    );

    if (isMtcRegistered) {
      throw new ForbiddenError(ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED, [
        MTC_NAME_IS_ALREADY_REGISTERED_MESSAGE,
      ]);
    }

    const newMtc = new MtcModel(requestModel);

    await newMtc.save();

    return new MtcViewModel(newMtc);
  }

  public async updateMtc(
    mtcId: string,
    requestModel: MtcRequestModel
  ): Promise<MtcViewModel> {
    this.validateMtcRequestModel(requestModel);

    const mtc = await this.tryGetMtcById(mtcId);

    if (mtc.name !== requestModel.name) {
      const isAnotherMtcRegisteredWithName = await this.checkIsMtcNameRegistered(
        requestModel.name,
        mtcId
      );

      if (isAnotherMtcRegisteredWithName) {
        throw new ForbiddenError(ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED, [
          MTC_NAME_IS_ALREADY_REGISTERED_MESSAGE,
        ]);
      }
    }

    Object.assign(mtc, requestModel);

    await mtc.save();

    return new MtcViewModel(mtc);
  }

  public async deleteMtc(
    mtcId: string
  ): Promise<StandardResponseViewModel<{}>> {
    const mtc = await this.tryGetMtcById(mtcId);

    await mtc.deleteOne();

    return new StandardResponseViewModel({}, undefined, 'success');
  }

  public async tryGetMtcById(
    mtcId: string,
    projection: string | IProjection = {}
  ): Promise<IMtcDocument> {
    const mtc = await MtcModel.findById(mtcId, projection);

    if (!mtc) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, [
        MTC_NOT_FOUND_MESSAGE,
      ]);
    }

    return mtc;
  }

  public async getCountOfMtcsByQuery(
    query: Record<string, unknown> = {},
    skip?: number,
    take?: number
  ) {
    if (!isNaN(take) && !isNaN(skip)) {
      return await MtcModel.countDocuments(query).skip(skip).limit(take);
    }

    return await MtcModel.countDocuments(query);
  }

  public async getMtcsListWithLazyLoading(
    searchQuery: Record<string, unknown> = {},
    sortingOptions: Record<string, unknown> = {},
    skip?: number,
    take?: number
  ) {
    let queryCall = MtcModel.find(searchQuery).sort(sortingOptions).populate({
      path: 'courses',
      select: 'title description -mtc',
    });

    if (!isNaN(take) && !isNaN(skip)) {
      queryCall = queryCall.skip(skip).limit(take);
    }

    return await queryCall;
  }

  public async getMtcCourses(mtcId: string): Promise<CoursesViewModel> {
    await this.checkDoesMtcExist(mtcId);

    return await this.courseService.getAllCourses({}, mtcId);
  }

  public async createUpdateMtcCourse(
    mtcId: string,
    requestModel: CourseRequestModel
  ): Promise<StandardResponseViewModel<CourseViewModel>> {
    await this.checkDoesMtcExist(mtcId);

    const course = await (requestModel.id
      ? this.courseService.updateCourse(requestModel, mtcId)
      : this.courseService.createCourse(requestModel, mtcId));

    return new StandardResponseViewModel<CourseViewModel>(
      course,
      requestModel.id ? MTC_COURSE_UPDATED_MESSAGE : MTC_COURSE_CREATED_MESSAGE,
      BaseStatusesEnum.OK
    );
  }

  public async uploadMtcPhoto(
    mtcPhotoData: MtcPhotoDataModel
  ): Promise<StandardResponseViewModel<MtcPhotoViewModel>> {
    const mtc = await this.tryGetMtcById(mtcPhotoData.mtcId);

    const { path, savePath, saveFileName } = mtcPhotoData;

    const errors = MtcPhotolValidator.validate(mtcPhotoData);

    if (errors.length) {
      throw new BadRequestError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }

    const [fileBinary] = await Promise.all([
      readFile(path),
      this.checkFileSaveDirectory(savePath, saveFileName),
    ]);

    try {
      await Promise.all([writeFile(savePath, fileBinary), rm(path)]);
    } catch (error) {
      throw new InternalServerError(ErrorCodes.FILE_OPERATION_ERROR, [
        error.message,
      ]);
    }

    mtc.photo = mtcPhotoData.saveFileName;

    await mtc.save();

    return new StandardResponseViewModel(
      new MtcPhotoViewModel(mtcPhotoData),
      MTC_PHOTO_SAVE_MESSAGE,
      BaseStatusesEnum.OK
    );
  }

  private validateMtcRequestModel(requestModel: MtcRequestModel) {
    const errors = MtcRequestModelValidator.validate(requestModel);

    if (errors.length) {
      throw new BadRequestError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private validateGetMtcsWithinRadiusParams(
    zipcode: string,
    distance: number,
    unit: string
  ) {
    const errors = GetWithinRadiusValidator.validate(zipcode, distance, unit);

    if (errors.length) {
      throw new BadRequestError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private async checkIsMtcNameRegistered(
    mtcName: string,
    excludedMtcId?: string
  ) {
    const searchQuery: ISearchQuery = { name: mtcName };

    if (excludedMtcId) {
      searchQuery._id = { $ne: excludedMtcId };
    }

    const mtc = await MtcModel.findOne(searchQuery, '_id name');

    return mtc !== null;
  }

  private async checkDoesMtcExist(mtcId: string): Promise<void> {
    const doesMtcExist = await MtcModel.exists({ _id: mtcId });

    if (!doesMtcExist) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, [
        MTC_NOT_FOUND_MESSAGE,
      ]);
    }
  }

  private getMtcsSortQuery(sortBy: MtcsSortByEnum, sortOrder: SortOrderEnum) {
    const sortOrderValue = sortOrder === SortOrderEnum.ASC ? 1 : -1;
    let sortQuery = {};

    switch (sortBy) {
      case MtcsSortByEnum.CITY:
        sortQuery = { 'location.city': sortOrderValue };
        break;
      case MtcsSortByEnum.COUNTRY:
        sortQuery = { 'location.city': sortOrderValue };
        break;
      case MtcsSortByEnum.CREATED:
        sortQuery = { _created: sortOrderValue };
        break;
      case MtcsSortByEnum.JOB_ASSISTANCE:
        sortQuery = { jobAssistance: sortOrderValue };
        break;
      case MtcsSortByEnum.MTC_NAME:
      default:
        sortQuery = { name: sortOrderValue };
    }

    return sortQuery;
  }

  private async checkFileSaveDirectory(
    savePath: string,
    saveFileName: string
  ): Promise<void> {
    const dirPath = savePath.slice(0, -(saveFileName.length + 1));

    if (!existsSync(dirPath)) {
      await mkdir(dirPath);
    }
  }
}
