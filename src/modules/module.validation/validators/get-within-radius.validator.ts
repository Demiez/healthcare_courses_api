import { Entry } from 'node-geocoder';
import { baseAddressRegex } from '../../../core/regex/geo-location.regex';
import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import { MeasurementUnitsEnum } from '../../module.mtc/enums';
import {
  DISTANCE_PROVIDE_VALUE_MESSAGE,
  FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE,
  LATITUDE_INTERVAL_MESSAGE,
  LATITUDE_PROVIDE_VALUE_MESSAGE,
  LONGITUDE_INTERVAL_MESSAGE,
  LONGITUDE_PROVIDE_VALUE_MESSAGE,
  UNIT_PROVIDE_VALUE_MESSAGE,
} from '../constants';
import { BaseValidator } from './base.validator';

export class GetWithinRadiusValidator extends BaseValidator {
  public static validate(zipcode: string, distance: number, unit: string) {
    this.errors = [];

    this.validateZipcode(zipcode, convertVariableToString({ zipcode }));
    this.validateDistance(distance, convertVariableToString({ distance }));
    this.validateUnit(unit, convertVariableToString({ unit }));

    return this.errors;
  }

  private static validateZipcode(zipcode: string, fieldName: string) {
    const error = this.validateStringField(zipcode, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!baseAddressRegex.test(zipcode)) {
      this.errors.push(new FieldIsBadModel(fieldName));
    }
  }

  private static validateDistance(distance: number, fieldName: string) {
    const error = this.validateNumberField(distance, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (distance <= 0) {
      this.errors.push(
        new FieldIsBadModel(fieldName, DISTANCE_PROVIDE_VALUE_MESSAGE)
      );
    }
  }

  private static validateUnit(unit: string, fieldName: string) {
    const error = this.validateStringField(unit, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (
      !Object.values(MeasurementUnitsEnum).includes(MeasurementUnitsEnum[unit])
    ) {
      this.errors.push(
        new FieldIsBadModel(fieldName, UNIT_PROVIDE_VALUE_MESSAGE)
      );
    }
  }
}
