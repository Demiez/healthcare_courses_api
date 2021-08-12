import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import app from '../../src/app';
import { StandardResponseViewModel } from '../../src/core/view-models';

chai.use(chaiHttp);
chai.should();

function checkRootEndpointResponseBody(body: StandardResponseViewModel) {
  body.should.haveOwnProperty('message');
  body.message.should.be.a('string');

  body.should.haveOwnProperty('status');
  body.status.should.be.a('string');

  body.message.should.equal('Root Endpoint Healthcare Courses API');
  body.status.should.equal('success');
}

describe(':: rootRoute', () => {
  it('should respond with HTTP 200 status', async () => {
    const res = await chai
      .request(app)
      .get('/')
      .catch((err) => {
        if (err.response) {
          return err.response as Response;
        } else {
          throw err;
        }
      });

    res.status.should.equal(200);
  });

  it('should respond with correct message and status', async () => {
    const res = await chai
      .request(app)
      .get('/')
      .catch((err) => {
        if (err.response) {
          return err.response as Response;
        } else {
          throw err;
        }
      });

    res.body.should.be.an('object');

    checkRootEndpointResponseBody(res.body);
  });
});
