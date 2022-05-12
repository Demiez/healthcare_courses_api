import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { AuthProvider } from '../../module.auth/providers/auth.provider';
import { UserController } from '../controllers/user.controller';

export default (app: Application) => {
  const authProvider = Container.get(AuthProvider);
  const userController = Container.get(UserController);

  app.patch(
    `${APP_ROOT}/user`,
    authProvider.checkAuthentication,
    wrapRouteAction((req, res, next) => userController.updateUser(req, res))
  );
};
