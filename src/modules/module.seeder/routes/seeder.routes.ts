import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { SeederController } from '../controllers/seeder.controller';

export default (app: Application) => {
  const seederController = Container.get(SeederController);

  app.get(
    `${APP_ROOT}/seeder/mtcs`,
    wrapRouteAction((req, res, next) => seederController.seedMtcs(req, res))
  );

  app.get(
    `${APP_ROOT}/seeder/courses`,
    wrapRouteAction((req, res, next) => seederController.seedCourses(req, res))
  );

  app.delete(
    `${APP_ROOT}/seeder/mtcs`,
    wrapRouteAction((req, res, next) => seederController.deleteMtcs(req, res))
  );
};
