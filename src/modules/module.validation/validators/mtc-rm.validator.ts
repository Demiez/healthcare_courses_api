import { isArray, isEmpty, isNil } from 'lodash';
import validator from 'validator';
import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import {
  MTC_ADDRESS_LENGTH,
  MTC_AVERAGE_RATING_MAX_VALUE,
  MTC_AVERAGE_RATING_MIN_VALUE,
  MTC_DESCRIPTION_LENGTH,
  MTC_NAME_LENGTH,
  MTC_PHONE_LENGTH,
} from '../../module.mtc/constants';
import { CareerTypesEnum } from '../../module.mtc/enums/career-types.enum';
import { MtcRequestModel } from '../../module.mtc/request-models';
import {
  ADDRESS_LENGTH_MESSAGE,
  AVERAGE_COST_MESSAGE,
  AVERAGE_RATING_INTERVAL_MESSAGE,
  DESCRIPTION_LENGTH_MESSAGE,
  NAME_LENGTH_MESSAGE,
  ONE_CAREER_MESSAGE,
  PHONE_LENGTH_MESSAGE,
  VALID_CAREER_MESSAGE,
  VALID_EMAIL_MESSAGE,
  VALID_URL_MESSAGE,
} from '../constants';
import { BaseValidator } from './base.validator';

export class MtcRequestModelValidator extends BaseValidator {
  public static validate(requestModel: MtcRequestModel) {
    this.errors = [];

    const {
      name,
      description,
      website,
      email,
      phone,
      address,
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
    this.validateDescription(
      description,
      convertVariableToString({ description })
    );
    this.validateWebsite(website, convertVariableToString({ website }));
    this.validatePhone(phone, convertVariableToString({ phone }));
    this.validateEmail(email, convertVariableToString({ email }));
    this.validateAddress(address, convertVariableToString({ address }));
    this.validateCareers(careers, convertVariableToString({ careers }));

    // Optional fields
    if (!isNil(averageRating)) {
      this.validateAverageRating(
        averageRating,
        convertVariableToString({ averageRating })
      );
    }

    if (!isNil(averageCost)) {
      this.validateAverageCost(
        averageCost,
        convertVariableToString({ averageCost })
      );
    }

    if (photo) {
      this.validatePhoto(photo, convertVariableToString({ photo }));
    }

    if (!isNil(housing)) {
      const error = this.validateBooleanField(
        housing,
        convertVariableToString({ housing })
      );

      if (error) {
        this.errors.push(error);
      }
    }

    if (!isNil(jobAssistance)) {
      const error = this.validateBooleanField(
        jobAssistance,
        convertVariableToString({ jobAssistance })
      );

      if (error) {
        this.errors.push(error);
      }
    }

    if (!isNil(jobGuarantee)) {
      const error = this.validateBooleanField(
        jobGuarantee,
        convertVariableToString({ jobGuarantee })
      );

      if (error) {
        this.errors.push(error);
      }
    }

    if (!isNil(acceptGiBill)) {
      const error = this.validateBooleanField(
        acceptGiBill,
        convertVariableToString({ acceptGiBill })
      );

      if (error) {
        this.errors.push(error);
      }
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
      this.errors.push(new FieldIsBadModel(fieldName, NAME_LENGTH_MESSAGE));
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
        new FieldIsBadModel(fieldName, DESCRIPTION_LENGTH_MESSAGE)
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
      this.errors.push(new FieldIsBadModel(fieldName, VALID_URL_MESSAGE));
    }
  }

  private static validatePhone(phone: string, fieldName: string) {
    const error = this.validateStringField(phone, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (phone.trim().length > MTC_PHONE_LENGTH) {
      this.errors.push(new FieldIsBadModel(fieldName, PHONE_LENGTH_MESSAGE));
    }
  }

  private static validateEmail(email: string, fieldName: string) {
    const error = this.validateStringField(email, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!validator.isEmail(email)) {
      this.errors.push(new FieldIsBadModel(fieldName, VALID_EMAIL_MESSAGE));
    }
  }

  private static validateAddress(address: string, fieldName: string) {
    const error = this.validateStringField(address, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (address.trim().length > MTC_ADDRESS_LENGTH) {
      this.errors.push(new FieldIsBadModel(fieldName, ADDRESS_LENGTH_MESSAGE));
    }
  }

  private static validateCareers(
    careers: Array<CareerTypesEnum>,
    fieldName: string
  ) {
    if (!careers || !isArray(careers) || isEmpty(careers)) {
      this.errors.push(new FieldIsBadModel(fieldName, ONE_CAREER_MESSAGE));
      return;
    }

    const allowedValues = Object.values(CareerTypesEnum);

    const isValidCareerList = careers.every((career) =>
      allowedValues.includes(career)
    );

    if (!isValidCareerList) {
      this.errors.push(new FieldIsBadModel(fieldName, VALID_CAREER_MESSAGE));
    }
  }

  private static validateAverageRating(
    averageRating: number,
    fieldName: string
  ) {
    const error = this.validateNumberField(averageRating, fieldName, true);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (
      averageRating < MTC_AVERAGE_RATING_MIN_VALUE ||
      averageRating > MTC_AVERAGE_RATING_MAX_VALUE
    ) {
      this.errors.push(
        new FieldIsBadModel(fieldName, AVERAGE_RATING_INTERVAL_MESSAGE)
      );
    }
  }

  private static validateAverageCost(averageCost: number, fieldName: string) {
    const error = this.validateNumberField(averageCost, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (averageCost < 0) {
      this.errors.push(new FieldIsBadModel(fieldName, AVERAGE_COST_MESSAGE));
    }
  }

  private static validatePhoto(photo: string, fieldName: string) {
    const error = this.validateStringField(photo, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }
  }
}
