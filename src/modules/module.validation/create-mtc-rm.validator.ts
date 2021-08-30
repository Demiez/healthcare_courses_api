import { isArray, isEmpty, isInteger, isNumber, isString } from 'lodash';
import validator from 'validator';
import { convertVariableToString } from '../../core/utils';
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

    this.validateName(name, convertVariableToString({ name }));
    // TODO? : add specific slug check
    this.validateSlug(slug, convertVariableToString({ slug }));
    this.validateDescription(
      description,
      convertVariableToString({ description })
    );
    this.validateWebsite(website, convertVariableToString({ website }));
    this.validatePhone(phone, convertVariableToString({ phone }));
    this.validateEmail(email, convertVariableToString({ email }));
    this.validateAddress(address, convertVariableToString({ address }));

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

  private static validateName(name: string, fieldName: string) {
    const error = this.validateStringField(name, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (name.trim().length > MTC_NAME_LENGTH) {
      this.errors.push(
        new FieldIsBadModel(
          fieldName,
          `Cannot be more than ${MTC_NAME_LENGTH} characters`
        )
      );
    }
  }

  private static validateSlug(slug: string, fieldName: string) {
    const error = this.validateStringField(slug, fieldName);

    if (error) {
      this.errors.push(error);
    }
  }

  private static validateDescription(description: string, fieldName: string) {
    const error = this.validateStringField(description, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (description.trim().length > MTC_DESCRIPTION_LENGTH) {
      this.errors.push(
        new FieldIsBadModel(
          fieldName,
          `Cannot be more than ${MTC_DESCRIPTION_LENGTH} characters`
        )
      );
    }
  }

  private static validateWebsite(website: string, fieldName: string) {
    const error = this.validateStringField(website, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!validator.isURL(website)) {
      this.errors.push(
        new FieldIsBadModel(fieldName, `Please provide valid URL`)
      );
    }
  }

  private static validatePhone(phone: string, fieldName: string) {
    const error = this.validateStringField(phone, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (phone.trim().length > MTC_PHONE_LENGTH) {
      this.errors.push(
        new FieldIsBadModel(
          fieldName,
          `Cannot be more than ${MTC_PHONE_LENGTH} characters`
        )
      );
    }
  }

  private static validateEmail(email: string, fieldName: string) {
    const error = this.validateStringField(email, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!validator.isEmail(email)) {
      this.errors.push(
        new FieldIsBadModel(fieldName, `Please provide valid email`)
      );
    }
  }

  private static validateAddress(address: string, fieldName: string) {
    const error = this.validateStringField(address, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (address.trim().length > MTC_ADDRESS_LENGTH) {
      this.errors.push(
        new FieldIsBadModel(
          fieldName,
          `Cannot be more than ${MTC_ADDRESS_LENGTH} characters`
        )
      );
    }
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
