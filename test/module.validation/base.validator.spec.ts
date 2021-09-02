import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { isEmpty } from 'lodash';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
// import sinonChai = require('sinon-chai');
import * as sinonChai from 'sinon-chai';
import { v4 } from 'uuid';
import app from '../../src/app';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../../src/core/constants';
import { logger, MongoMockHelper } from '../../src/core/utils';
import {
  generateRandomInteger,
  generateRandomNumber,
} from '../../src/core/utils';
import { BaseValidator } from '../../src/modules/module.validation';

chai.use(sinonChai);
chai.should();

const expect = chai.expect;

const globalData = {
  stringValue: v4(),
  numberValue: generateRandomNumber(0, 10),
  integerValue: generateRandomInteger(0, 10),
  booleanValue: true,
  fieldName: 'Field Name',
};

describe.only('UT - Base validator', () => {
  const sandbox = sinon.createSandbox();

  class BaseValidatorTester extends BaseValidator {
    public static testStringValidation(value: string, fieldName: string) {
      return this.validateStringField(value, fieldName);
    }

    constructor() {
      super();
    }
  }

  describe(':: method validateStringField', () => {
    // let baseValidatorTesterSpy: sinon.SinonSpy;

    beforeEach(async () => {
      sandbox.spy(BaseValidatorTester, 'testStringValidation');
    });

    afterEach(async () => {
      sandbox.restore();
    });

    it('should validate valid data', async () => {
      BaseValidatorTester.testStringValidation(
        globalData.stringValue,
        globalData.fieldName
      );

      // sinon.assert.calledOnce(TestBaseValidator.testStringValidation);

      // BaseValidatorTester.testStringValidation.should.be.calledOnce;
      expect(BaseValidatorTester.testStringValidation).to.be.calledOnce;
      expect(BaseValidatorTester.testStringValidation).to.have.been.calledWith(
        globalData.stringValue,
        globalData.fieldName
      );
      expect(BaseValidatorTester.testStringValidation).returned(void 0);
    });
  });
});
