import { Service } from 'typedi';
import { SortOrderEnum } from '../../../core/enums';
import {
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection, ISearchQuery } from '../../../core/interfaces';
import { geocoder } from '../../../core/utils';
import { StandardResponseViewModel } from '../../../core/view-models';
import { CoursesViewModel } from '../../module.course/models';
import { CourseService } from '../../module.course/services/course.service';
import { MtcRequestModelValidator } from '../../module.validation';
import { GetWithinRadiusValidator } from '../../module.validation/validators/get-within-radius.validator';
import {
  EARTH_RADIUS_IN_KM,
  EARTH_RADIUS_IN_MI,
  MTC_NAME_IS_ALREADY_REGISTERED_MESSAGE,
  MTC_NOT_FOUND_MESSAGE,
} from '../constants';
import { IMtcDocument, MtcModel } from '../db-models/mtc.db';
import { MeasurementUnitsEnum, MtcsSortByEnum } from '../enums';
import {
  MtcRequestModel,
  MtcsSearchOptionsRequestModel,
  MtcsViewModel,
  MtcViewModel,
} from '../models';

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
    mtcId: String,
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
    const doesMtcExist = await MtcModel.exists({ _id: mtcId });

    if (!doesMtcExist) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, [
        MTC_NOT_FOUND_MESSAGE,
      ]);
    }

    return await this.courseService.getAllCourses({}, mtcId);
  }

  // public async checkIsMtcExist(mtcId: string): Promise<boolean> {
  //   const result: boolean = await MtcModel.exists({ _id: mtcId });

  //   return result;
  // }

  private validateMtcRequestModel(requestModel: MtcRequestModel) {
    const errors = MtcRequestModelValidator.validate(requestModel);

    if (errors.length) {
      throw new ForbiddenError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private validateGetMtcsWithinRadiusParams(
    zipcode: string,
    distance: number,
    unit: string
  ) {
    const errors = GetWithinRadiusValidator.validate(zipcode, distance, unit);

    if (errors.length) {
      throw new ForbiddenError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
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
}
