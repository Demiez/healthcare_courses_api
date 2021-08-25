import { isArray, isEmpty, isInteger, isNumber, isString } from 'lodash';
import validator from 'validator';
import { FieldIsBadModel } from '../../core/view-models';
import {
  MTC_ADDRESS_LENGTH,
  MTC_AVERAGE_RATING_MAX_VALUE,
  MTC_AVERAGE_RATING_MIN_VALUE,
  MTC_DESCRIPTION_LENGTH,
  MTC_NAME_LENGTH,
  MTC_PHONE_LENGTH,
} from '../module.mtc/constants';
import { CareerTypesEnum } from '../module.mtc/enums/career-types.enum';
import { CreateMtcRequestModel } from '../module.mtc/request-models';
import { BaseValidator } from './base.validator';

export class CreateMtcRequestModelValidator extends BaseValidator {
  public static validate(requestModel: CreateMtcRequestModel) {
    this.errors = [];

    const {
      name,
      slug,
      description,
      website,
      email,
      phone,
      address,
      location,
      careers,
      averageRating,
      averageCost,
      photo,
      housing,
      jobAssistance,
      jobGuarantee,
      acceptGiBill,
    } = requestModel;

    if (!isString(name) || name.trim().length > MTC_NAME_LENGTH) {
      this.errors.push(new FieldIsBadModel('name'));
    }

    // TODO? : add specific slug check
    if (!isString(slug)) {
      this.errors.push(new FieldIsBadModel('slug'));
    }

    if (
      !isString(description) ||
      description.trim().length > MTC_DESCRIPTION_LENGTH
    ) {
      this.errors.push(new FieldIsBadModel('description'));
    }

    if (!website || !validator.isURL(website)) {
      this.errors.push(new FieldIsBadModel('website'));
    }

    if (!isString(phone) || phone.trim().length > MTC_PHONE_LENGTH) {
      this.errors.push(new FieldIsBadModel('phone'));
    }

    if (!email || !validator.isEmail(email)) {
      this.errors.push(new FieldIsBadModel('email'));
    }

    if (!isString(address) || address.trim().length > MTC_ADDRESS_LENGTH) {
      this.errors.push(new FieldIsBadModel('address'));
    }

    // TODO : specific location validation (GeoJson)
    // if (!location) {
    //   this.errors.push(new FieldIsBadModel('location'));
    // }

    if (
      !careers ||
      !isArray(careers) ||
      isEmpty(careers) ||
      !this.validateCareers(careers)
    ) {
      this.errors.push(new FieldIsBadModel('careers'));
    }

    // Optional fields
    if (averageRating) {
      this.validateAverageRating(averageRating);
    }

    if (averageCost) {
      this.validateAverageCost(averageCost);
    }

    if (photo) {
      this.validatePhoto(photo);
    }

    if (housing) {
      this.validateBooleanField(housing, 'housing');
    }

    if (jobAssistance) {
      this.validateBooleanField(jobAssistance, 'jobAssistance');
    }

    if (jobGuarantee) {
      this.validateBooleanField(jobGuarantee, 'jobGuarantee');
    }

    if (acceptGiBill) {
      this.validateBooleanField(acceptGiBill, 'acceptGiBill');
    }

    return this.errors;
  }

  private static validateCareers(careers: Array<CareerTypesEnum>) {
    const allowedValues = Object.values(CareerTypesEnum);

    const isValid = careers.every((career) => {
      if (!allowedValues.includes(career)) {
        return false;
      }
      return true;
    });

    return isValid;
  }

  private static validateAverageRating(averageRating: number) {
    if (
      !isInteger(averageRating) ||
      averageRating < MTC_AVERAGE_RATING_MIN_VALUE ||
      averageRating > MTC_AVERAGE_RATING_MAX_VALUE
    ) {
      this.errors.push(new FieldIsBadModel('averageRating'));
    }
  }

  private static validateAverageCost(averageCost: number) {
    if (!isNumber(averageCost) || averageCost < 0) {
      this.errors.push(new FieldIsBadModel('averageCost'));
    }
  }

  private static validatePhoto(photo: string) {
    if (!isString(photo)) {
      this.errors.push(new FieldIsBadModel('photo'));
    }
  }
}
