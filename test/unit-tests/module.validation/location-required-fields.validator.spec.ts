import * as chai from 'chai';
import { cloneDeep } from 'lodash';
import 'mocha';
import { Entry } from 'node-geocoder';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { v4 } from 'uuid';
import {
  generateRandomInteger,
  generateRandomNumber,
  generateStringOfLength,
} from '../../../src/core/utils';
import { FieldIsBadModel } from '../../../src/core/view-models';
import { LocationRequiredFieldsValidator } from '../../../src/modules/module.validation';
import {
  FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE,
  LATITUDE_INTERVAL_MESSAGE,
  LATITUDE_PROVIDE_VALUE_MESSAGE,
  LONGITUDE_INTERVAL_MESSAGE,
  LONGITUDE_PROVIDE_VALUE_MESSAGE,
} from '../../../src/modules/module.validation/constants';
import { BaseValidationMessagesEnum } from '../../../src/modules/module.validation/enums';

chai.use(sinonChai);
const expect = chai.expect;

const globalData = {
  mtcGeocodeLocationEntry: {} as Entry,
  defaultValidationResponse: [] as Array<FieldIsBadModel>,
  stringValue: generateStringOfLength(10),
  numberValue: generateRandomNumber(0, 10),
};

function testNoValueProvidedCase(
  spiedMethod: Function,
  args: any,
  fieldName: string,
  provideValueMessage: string
) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(args);
  expect(spiedMethod).returned([
    new FieldIsBadModel(fieldName, provideValueMessage),
  ]);
}

function testValueProvidedCase(
  spiedMethod: Function,
  args: any,
  expectedReturn: Array<FieldIsBadModel> = []
) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(args);
  expect(spiedMethod).returned(expectedReturn);
}

describe('UT - LocationRequiredFieldsValidator', () => {
  const sandbox = sinon.createSandbox();
  let testData: Entry;

  class LocationRequiredFieldsValidatorTester extends LocationRequiredFieldsValidator {
    constructor() {
      super();
    }
  }

  before(async () => {
    await setupData();
  });

  beforeEach(async () => {
    sandbox.spy(LocationRequiredFieldsValidatorTester, 'validate');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  describe(':: longitude validation', () => {
    it('should process valid longitude data when longitude is between -180 and 180', async () => {
      testData = cloneDeep(globalData.mtcGeocodeLocationEntry);

      LocationRequiredFieldsValidatorTester.validate(testData);

      expect(LocationRequiredFieldsValidatorTester.validate).calledOnce;
      expect(LocationRequiredFieldsValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(LocationRequiredFieldsValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no longitude provided', async () => {
      testData.longitude = undefined;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testNoValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        'longitude',
        LONGITUDE_PROVIDE_VALUE_MESSAGE
      );
    });

    it('should return FieldIsBadModel when longitude is not a number', async () => {
      testData.longitude = globalData.stringValue as any;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'longitude',
            BaseValidationMessagesEnum.MUST_BE_NUMBER
          ),
        ]
      );
    });

    it(`should return FieldIsBadModel when longitude is more than 180`, async () => {
      testData.longitude = 181;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [new FieldIsBadModel('longitude', LONGITUDE_INTERVAL_MESSAGE)]
      );
    });

    it(`should return FieldIsBadModel when longitude is less than -180`, async () => {
      testData.longitude = -181;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [new FieldIsBadModel('longitude', LONGITUDE_INTERVAL_MESSAGE)]
      );
    });
  });

  describe(':: latitude validation', () => {
    it('should process valid latitude data when latitude is between -90 and 90', async () => {
      testData = cloneDeep(globalData.mtcGeocodeLocationEntry);

      LocationRequiredFieldsValidatorTester.validate(testData);

      expect(LocationRequiredFieldsValidatorTester.validate).calledOnce;
      expect(LocationRequiredFieldsValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(LocationRequiredFieldsValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no latitude provided', async () => {
      testData.latitude = undefined;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testNoValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        'latitude',
        LATITUDE_PROVIDE_VALUE_MESSAGE
      );
    });

    it('should return FieldIsBadModel when latitude is not a number', async () => {
      testData.latitude = globalData.stringValue as any;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'latitude',
            BaseValidationMessagesEnum.MUST_BE_NUMBER
          ),
        ]
      );
    });

    it(`should return FieldIsBadModel when latitude is more than 90`, async () => {
      testData.latitude = 91;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [new FieldIsBadModel('latitude', LATITUDE_INTERVAL_MESSAGE)]
      );
    });

    it(`should return FieldIsBadModel when latitude is less than -90`, async () => {
      testData.latitude = -91;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [new FieldIsBadModel('latitude', LATITUDE_INTERVAL_MESSAGE)]
      );
    });
  });

  describe(':: formattedAddress validation', () => {
    it('should process valid formattedAddress data', async () => {
      testData = cloneDeep(globalData.mtcGeocodeLocationEntry);

      LocationRequiredFieldsValidatorTester.validate(testData);

      expect(LocationRequiredFieldsValidatorTester.validate).calledOnce;
      expect(LocationRequiredFieldsValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(LocationRequiredFieldsValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no formattedAddress provided', async () => {
      testData.formattedAddress = undefined;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testNoValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        'formattedAddress',
        FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE
      );
    });

    it('should return FieldIsBadModel when formattedAddress is not a string', async () => {
      testData.formattedAddress = globalData.numberValue as any;

      LocationRequiredFieldsValidatorTester.validate(testData);

      testValueProvidedCase(
        LocationRequiredFieldsValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'formattedAddress',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });
  });
});

async function setupData() {
  globalData.mtcGeocodeLocationEntry = {
    longitude: -73.86954 + generateRandomInteger(0, 10),
    latitude: 40.733401 + generateRandomInteger(0, 10),
    formattedAddress: `formatted-address-${v4()}`,
  } as Entry;
}
