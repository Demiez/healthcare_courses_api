import { Application, Request, Response } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { MtcController } from '../controllers/mtc.controller';

export default (app: Application) => {
  const mtcController = Container.get(MtcController);

  app.get(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) => mtcController.getAllMtcs(req, res))
  );

  app.get(
    `${APP_ROOT}/mtcs/radius/:zipcode/:distance`,
    wrapRouteAction((req, res, next) =>
      mtcController.getMtcsWithinRadius(req, res)
    )
  );

  app.get(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.getMtc(req, res))
  );

  app.post(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) => mtcController.createMtc(req, res))
  );

  app.put(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.updateMtc(req, res))
  );

  app.delete(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.deleteMtc(req, res))
  );

  app.get(
    `${APP_ROOT}/mtcs/:mtcId/courses`,
    wrapRouteAction((req, res, next) => mtcController.getMtcCourses(req, res))
  );
};
