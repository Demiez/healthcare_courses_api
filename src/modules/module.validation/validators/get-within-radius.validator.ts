import { Entry } from 'node-geocoder';
import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import {
  FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE,
  LATITUDE_INTERVAL_MESSAGE,
  LATITUDE_PROVIDE_VALUE_MESSAGE,
  LONGITUDE_INTERVAL_MESSAGE,
  LONGITUDE_PROVIDE_VALUE_MESSAGE,
} from '../constants';
import { BaseValidator } from './base.validator';

export class GetWithinRadiusValidator extends BaseValidator {
  public static validate(zipcode: string, distance: string, unit: string) {
    this.errors = [];

    this.validateZipcode(zipcode, convertVariableToString({ zipcode }));
    this.validateDistance(distance, convertVariableToString({ distance }));
    this.validateFormattedAddress(
      formattedAddress,
      convertVariableToString({ formattedAddress })
    );

    return this.errors;
  }

  private static validateZipcode(zipcode: string, fieldName: string) {
    const error = this.validateStringField(zipcode, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (isFinite(longitude) && Math.abs(longitude) >= 180) {
      this.errors.push(
        new FieldIsBadModel(fieldName, LONGITUDE_INTERVAL_MESSAGE)
      );
    }
  }

  private static validateDistance(distance: string, fieldName: string) {
    const error = this.validateNumberField(
      latitude,
      fieldName,
      false,
      LATITUDE_PROVIDE_VALUE_MESSAGE
    );

    if (error) {
      this.errors.push(error);
      return;
    }

    if (isFinite(latitude) && Math.abs(latitude) >= 90) {
      this.errors.push(
        new FieldIsBadModel(fieldName, LATITUDE_INTERVAL_MESSAGE)
      );
    }
  }

  private static validateFormattedAddress(
    formattedAddress: string,
    fieldName: string
  ) {
    const error = this.validateStringField(
      formattedAddress,
      fieldName,
      FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE
    );

    if (error) {
      this.errors.push(error);
      return;
    }
  }
}
