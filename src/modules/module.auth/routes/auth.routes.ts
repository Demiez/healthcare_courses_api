import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { AuthController } from '../controllers/auth.controller';

export default (app: Application) => {
  const authController = Container.get(AuthController);

  app.post(
    `${APP_ROOT}/auth/register`,
    wrapRouteAction((req, res, next) => authController.registerUser(req, res))
  );
};
