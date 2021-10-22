import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { v4 } from 'uuid';
import {
  generateRandomBoolean,
  generateRandomInteger,
  generateRandomNumber,
} from '../../src/core/utils';
import { FieldIsBadModel } from '../../src/core/view-models';
import { BaseValidator } from '../../src/modules/module.validation';
import { BaseValidationMessagesEnum } from '../../src/modules/module.validation/enums';

chai.use(sinonChai);
const expect = chai.expect;

const globalData = {
  stringValue: `string-value-${v4()}`,
  numberValue: generateRandomNumber(0, 10),
  integerValue: generateRandomInteger(0, 10),
  booleanValue: generateRandomBoolean(),
  fieldName: `field-name-${v4()}`,
};

function testNoArgsProvidedCase(spiedMethod: Function) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(undefined, undefined);
  expect(spiedMethod).throw;
}

function testNoValueProvidedCase(spiedMethod: Function) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(undefined, globalData.fieldName);
  expect(spiedMethod).returned(
    new FieldIsBadModel(
      globalData.fieldName,
      BaseValidationMessagesEnum.PROVIDE_VALUE_MESSAGE
    )
  );
}

describe('UT - BaseValidator', () => {
  const sandbox = sinon.createSandbox();

  class BaseValidatorTester extends BaseValidator {
    public static testValidateStringField(
      value: string,
      fieldName: string,
      customProvideValueMessage?: string
    ) {
      return this.validateStringField(
        value,
        fieldName,
        customProvideValueMessage
      );
    }

    public static testValidateNumberField(
      value: number,
      fieldName: string,
      isIntegerValue?: boolean,
      customProvideValueMessage?: string
    ) {
      return this.validateNumberField(
        value,
        fieldName,
        isIntegerValue,
        customProvideValueMessage
      );
    }

    public static testValidateBooleanField(value: boolean, fieldName: string) {
      return this.validateBooleanField(value, fieldName);
    }

    constructor() {
      super();
    }
  }

  describe(':: method validateStringField', () => {
    beforeEach(async () => {
      sandbox.spy(BaseValidatorTester, 'testValidateStringField');
    });

    afterEach(async () => {
      sandbox.restore();
    });

    it('should process valid data', async () => {
      BaseValidatorTester.testValidateStringField(
        globalData.stringValue,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateStringField).calledOnce;
      expect(BaseValidatorTester.testValidateStringField).calledWithExactly(
        globalData.stringValue,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateStringField).returned(void 0);
    });

    it('should throw error when no args provided', async () => {
      BaseValidatorTester.testValidateStringField(undefined, undefined);

      testNoArgsProvidedCase(BaseValidatorTester.testValidateStringField);
    });

    it('should return FieldIsBadModel when no value provided', async () => {
      BaseValidatorTester.testValidateStringField(
        undefined,
        globalData.fieldName
      );

      testNoValueProvidedCase(BaseValidatorTester.testValidateStringField);
    });

    it('should return FieldIsBadModel when provided not a string value', async () => {
      BaseValidatorTester.testValidateStringField(
        globalData.numberValue as any,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateStringField).calledOnce;
      expect(BaseValidatorTester.testValidateStringField).calledWithExactly(
        globalData.numberValue as any,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateStringField).returned(
        new FieldIsBadModel(
          globalData.fieldName,
          BaseValidationMessagesEnum.MUST_BE_STRING
        )
      );
    });

    it('should return FieldIsBadModel with customProvideValueMessage if present for no value case', async () => {
      const customProvideValueMessage = `custom-message-string-${v4()}`;

      BaseValidatorTester.testValidateStringField(
        undefined,
        globalData.fieldName,
        customProvideValueMessage
      );

      expect(BaseValidatorTester.testValidateStringField).calledOnce;
      expect(BaseValidatorTester.testValidateStringField).calledWithExactly(
        undefined,
        globalData.fieldName,
        customProvideValueMessage
      );
      expect(BaseValidatorTester.testValidateStringField).returned(
        new FieldIsBadModel(globalData.fieldName, customProvideValueMessage)
      );
    });
  });

  describe(':: method validateNumberField', () => {
    beforeEach(async () => {
      sandbox.spy(BaseValidatorTester, 'testValidateNumberField');
    });

    afterEach(async () => {
      sandbox.restore();
    });

    it('should process valid number data', async () => {
      BaseValidatorTester.testValidateNumberField(
        globalData.numberValue,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateNumberField).calledOnce;
      expect(BaseValidatorTester.testValidateNumberField).calledWithExactly(
        globalData.numberValue,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateNumberField).returned(void 0);
    });

    it('should process valid integer data', async () => {
      BaseValidatorTester.testValidateNumberField(
        globalData.integerValue,
        globalData.fieldName,
        true
      );

      expect(BaseValidatorTester.testValidateNumberField).calledOnce;
      expect(BaseValidatorTester.testValidateNumberField).calledWithExactly(
        globalData.integerValue,
        globalData.fieldName,
        true
      );
      expect(BaseValidatorTester.testValidateNumberField).returned(void 0);
    });

    it('should throw error when no args provided', async () => {
      BaseValidatorTester.testValidateNumberField(undefined, undefined);

      testNoArgsProvidedCase(BaseValidatorTester.testValidateNumberField);
    });

    it('should return FieldIsBadModel when no value provided', async () => {
      BaseValidatorTester.testValidateNumberField(
        undefined,
        globalData.fieldName
      );

      testNoValueProvidedCase(BaseValidatorTester.testValidateNumberField);
    });

    it('should return FieldIsBadModel when provided not a number value', async () => {
      BaseValidatorTester.testValidateNumberField(
        globalData.stringValue as any,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateNumberField).calledOnce;
      expect(BaseValidatorTester.testValidateNumberField).calledWithExactly(
        globalData.stringValue as any,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateNumberField).returned(
        new FieldIsBadModel(
          globalData.fieldName,
          BaseValidationMessagesEnum.MUST_BE_NUMBER
        )
      );
    });

    it('should return FieldIsBadModel when provided not an integer value', async () => {
      BaseValidatorTester.testValidateNumberField(
        globalData.numberValue,
        globalData.fieldName,
        true
      );

      expect(BaseValidatorTester.testValidateNumberField).calledOnce;
      expect(BaseValidatorTester.testValidateNumberField).calledWithExactly(
        globalData.numberValue,
        globalData.fieldName,
        true
      );
      expect(BaseValidatorTester.testValidateNumberField).returned(
        new FieldIsBadModel(
          globalData.fieldName,
          BaseValidationMessagesEnum.MUST_BE_INTEGER
        )
      );
    });

    it('should return FieldIsBadModel with customProvideValueMessage if present for no value case', async () => {
      const customProvideValueMessage = `custom-message-number-${v4()}`;

      BaseValidatorTester.testValidateNumberField(
        undefined,
        globalData.fieldName,
        false,
        customProvideValueMessage
      );

      expect(BaseValidatorTester.testValidateNumberField).calledOnce;
      expect(BaseValidatorTester.testValidateNumberField).calledWithExactly(
        undefined,
        globalData.fieldName,
        false,
        customProvideValueMessage
      );
      expect(BaseValidatorTester.testValidateNumberField).returned(
        new FieldIsBadModel(globalData.fieldName, customProvideValueMessage)
      );
    });
  });

  describe(':: method validateBooleanField', () => {
    beforeEach(async () => {
      sandbox.spy(BaseValidatorTester, 'testValidateBooleanField');
    });

    afterEach(async () => {
      sandbox.restore();
    });

    it('should process valid boolean data', async () => {
      BaseValidatorTester.testValidateBooleanField(
        globalData.booleanValue,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateBooleanField).calledOnce;
      expect(BaseValidatorTester.testValidateBooleanField).calledWithExactly(
        globalData.booleanValue,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateBooleanField).returned(void 0);
    });

    it('should throw error when no args provided', async () => {
      BaseValidatorTester.testValidateBooleanField(undefined, undefined);

      testNoArgsProvidedCase(BaseValidatorTester.testValidateBooleanField);
    });

    it('should return FieldIsBadModel when no value provided', async () => {
      BaseValidatorTester.testValidateBooleanField(
        undefined,
        globalData.fieldName
      );

      testNoValueProvidedCase(BaseValidatorTester.testValidateBooleanField);
    });

    it('should return FieldIsBadModel when provided not a boolean value', async () => {
      BaseValidatorTester.testValidateBooleanField(
        globalData.stringValue as any,
        globalData.fieldName
      );

      expect(BaseValidatorTester.testValidateBooleanField).calledOnce;
      expect(BaseValidatorTester.testValidateBooleanField).calledWithExactly(
        globalData.stringValue as any,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testValidateBooleanField).returned(
        new FieldIsBadModel(
          globalData.fieldName,
          BaseValidationMessagesEnum.MUST_BE_BOOLEAN
        )
      );
    });
  });
});
