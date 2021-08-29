import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import { Query } from 'mongoose';
import { v4 } from 'uuid';
import app from '../../src/app';
import { APP_ROOT } from '../../src/core/constants';
import { ErrorCodes } from '../../src/core/errors';
import { MtcModel } from '../../src/modules/module.mtc/data-models/mtc.dm';
import { CareerTypesEnum } from '../../src/modules/module.mtc/enums/career-types.enum';
import { CreateMtcRequestModel } from '../../src/modules/module.mtc/request-models';
import { MtcViewModel } from '../../src/modules/module.mtc/view-models';

chai.use(chaiHttp);
chai.should();

const globalData = {
  createMtcRequestModel: {} as CreateMtcRequestModel,
  mtcName01: '',
};

const checkCreateMtcResponseBody = (body: MtcViewModel) => {
  body.should.have.property('id');
  body.id.should.be.a('string');

  body.should.have.property('name');
  body.name.should.be.a('string');

  body.should.have.property('slug');
  body.slug.should.be.a('string');

  body.should.have.property('description');
  body.description.should.be.a('string');

  body.should.have.property('website');
  body.website.should.be.a('string');

  body.should.have.property('phone');
  body.phone.should.be.a('string');

  body.should.have.property('email');
  body.email.should.be.a('string');

  body.should.have.property('address');
  body.address.should.be.a('string');

  body.should.have.property('location');
  body.location.should.be.an('object');
  // TODO : Add indepth location check
  body.location.should.be.empty;

  body.should.have.property('careers');
  body.careers.should.be.an('array');
  body.careers.forEach((career) =>
    career.should.be.oneOf(Object.values(CareerTypesEnum))
  );

  body.should.have.property('averageRating');
  body.averageRating.should.be.a('number');

  body.should.have.property('averageCost');
  body.averageCost.should.be.a('number');

  body.should.have.property('photo');
  body.photo.should.be.a('string');

  body.should.have.property('housing');
  body.housing.should.be.a('boolean');

  body.should.have.property('jobAssistance');
  body.jobAssistance.should.be.a('boolean');

  body.should.have.property('jobGuarantee');
  body.jobGuarantee.should.be.a('boolean');

  body.should.have.property('acceptGiBill');
  body.acceptGiBill.should.be.a('boolean');
};

const checkBaseErrorResponse = (res: Response, resStatus: number) => {
  res.status.should.equal(resStatus);
  res.body.should.be.an('object');
  res.body.should.have.property('errorCode').that.is.a('string');
  res.body.should.have.property('errorDetails').that.is.an('array');
  res.body.should.have.property('type').that.is.a('string');
};

describe.only('MTC Controller', () => {
  before(async () => {
    await setupData();
  });

  after(async () => {
    await clearData();
  });

  describe(':: POST part', () => {
    it('Create mtc with valid request model', async () => {
      const res = await chai
        .request(app)
        .post(`${APP_ROOT}/mtcs`)
        .send(globalData.createMtcRequestModel)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.status.should.equal(200);
      res.body.should.be.an('object');
      checkCreateMtcResponseBody(res.body);
      globalData.mtcName01 = (res.body as MtcViewModel).name;
    });

    it('Create mtc with already existing name', async () => {
      const res = await chai
        .request(app)
        .post(`${APP_ROOT}/mtcs`)
        .send(globalData.createMtcRequestModel)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      checkBaseErrorResponse(res as Response, 403);
      res.body.errorCode.should.equal(
        ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED
      );
      res.body.errorDetails[0].should.equal(
        'MTC with such name is already registered'
      );
    });
  });
});

async function setupData() {
  globalData.createMtcRequestModel = new CreateMtcRequestModel({
    name: `mtc-name-${v4()}`,
    slug: `mtc-slug-${v4()}`,
    description: `mtc-description-${v4()}`,
    website: `https://www.mtc-website-${v4()}.com`,
    phone: '(111) 222-0000',
    email: `mtc-email-${v4()}@gmail.com`,
    address: `mtc-address-${v4()}`,
    careers: [
      CareerTypesEnum.EKG_TECHNICIAN,
      CareerTypesEnum.PHLEBOTOMY_TECHNICIAN,
      CareerTypesEnum.PATIENT_CARE_TECHNICIAN,
      CareerTypesEnum.CERTIFIED_NURSE_AIDE,
      CareerTypesEnum.PERSONAL_CARE_AIDE,
      CareerTypesEnum.HOME_HEALTH_AIDE,
      CareerTypesEnum.BLS_CPR,
    ],
    averageRating: 5,
    averageCost: 1000,
    photo: `mtc-photo-${v4()}.jpg`,
    housing: true,
    jobAssistance: true,
    jobGuarantee: false,
    acceptGiBill: true,
  });
}

async function clearData() {
  await Promise.all<Query<unknown, unknown> | Promise<unknown>>([
    MtcModel.deleteMany({}),
  ]);
}
